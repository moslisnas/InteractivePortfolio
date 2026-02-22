import { ArcRotateCamera, Mesh, Vector3 } from '@babylonjs/core';
import { AnimationGroup } from '@babylonjs/core/Animations/animationGroup';
import { InteractionService } from '../../core/interaction.service';

export class PlayerController {
  private playerCube?: Mesh;
  private camera?: ArcRotateCamera;
  private keysPressed: { [key: string]: boolean } = {};
  private targetPosition?: Vector3;
  private selectedPointId?: string;
  private meshes: { [key: string]: any } = {};
  private proximityThreshold = 3.2; // distance to detect adjacent cubes (1.5 + 1.5 + margin)
  private stepSize = 1.5; // single-step equals cube size
  private autoMoveAccumulator = 0; // accumulator for smooth auto-movement
  private autoMoveStepThreshold = 0.36; // threshold to trigger next auto-step (higher = slower)
  private animationGroups?: AnimationGroup[];
  private isWalking = false;
  private idleAnimation?: AnimationGroup;
  private walkAnimation?: AnimationGroup;
  private walkEndObserver: any = null;
  private walkLocked = false;
  private idleTimer: any = null;
  private movementKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  private keyboardAccumulator = 0; // accumulator for continuous keyboard movement
  private keyboardStepDelay = 0.35; // delay between steps when holding arrow key
  private keyPressedTime: { [key: string]: number } = {}; // track time each key is held

  constructor(private interactionService: InteractionService) {
    // Listen to deselection events to clear selection when panel is closed
    this.interactionService.pick$.subscribe((pickInfo) => {
      if (!pickInfo.pointId) {
        this.selectedPointId = undefined;
      }
    });
  }

  private snapToGrid(value: number, gridSize: number = 1.5): number {
    return Math.round(value / gridSize) * gridSize;
  }

  private rotatePlayerTowardDirection(direction: Vector3): void {
    if (!this.playerCube) return;
    // Calculate angle from direction vector (X, Z plane)
    // We want: Z- = forward (0), X+ = left (π/2), Z+ = back (π), X- = right (-π/2)
    const angle = Math.atan2(direction.x, direction.z);
    // Rotate around Y axis (heading/yaw)
    this.playerCube.rotation.y = angle;
  }

  private getDirection(key: string): Vector3 | null {
    switch (key) {
      case 'ArrowUp':
        return new Vector3(0, 0, -1);
      case 'ArrowDown':
        return new Vector3(0, 0, 1);
      case 'ArrowLeft':
        return new Vector3(1, 0, 0);
      case 'ArrowRight':
        return new Vector3(-1, 0, 0);
      default:
        return null;
    }
  }

  private canMoveTo(newPosition: Vector3): boolean {
    if (!this.playerCube) return false;

    // Check collision with all meshes except player
    for (const [meshId, mesh] of Object.entries(this.meshes)) {
      if (meshId === 'player' || !mesh) continue;
      const distance = Vector3.Distance(newPosition, mesh.position);
      // Collision radius: player 0.75 + obstacle 0.75 = 1.5, with small buffer
      if (distance < 1.5) {
        return false;
      }
    }
    return true;
  }

  setMeshes(meshes: { [key: string]: any }) {
    this.meshes = meshes;
  }

  attachPlayer(mesh: Mesh) {
    this.playerCube = mesh;
    // enable collisions and set an ellipsoid for smoother collision behavior (if not already set)
    if (!this.playerCube.checkCollisions) {
      this.playerCube.checkCollisions = true;
      this.playerCube.ellipsoid = new Vector3(0.75, 0.75, 0.75);
    }
    // snap to grid to ensure correct alignment
    this.playerCube.position = new Vector3(
      this.snapToGrid(this.playerCube.position.x),
      this.playerCube.position.y,
      this.snapToGrid(this.playerCube.position.z)
    );

    // extract animation groups from metadata if provided by loader
    const meta = (mesh as any).metadata;
    if (meta && Array.isArray(meta.animationGroups)) {
      this.animationGroups = meta.animationGroups as AnimationGroup[];
      // detect idle/walk animations by name (case-insensitive)
      for (const g of this.animationGroups) {
        const n = (g.name || '').toLowerCase();
        if (!this.idleAnimation && n.includes('idle')) this.idleAnimation = g;
        if (!this.walkAnimation && (n.includes('walk') || n.includes('run'))) this.walkAnimation = g;
      }
      // fallbacks - ensure we always have animations
      if (!this.idleAnimation && this.animationGroups.length > 0) this.idleAnimation = this.animationGroups[0];
      if (!this.walkAnimation && this.animationGroups.length > 1) this.walkAnimation = this.animationGroups[1];
      if (!this.walkAnimation && this.animationGroups.length > 0) this.walkAnimation = this.animationGroups[0];
      
      // Start idle animation by default
      this.playIdle();
    }
  }

  attachCamera(cam: ArcRotateCamera) {
    this.camera = cam;
  }

  onKeyDown = (event: KeyboardEvent) => {
    // Handle interaction keys (spacebar and Enter)
    if (event.code === 'Space' || event.key === 'Enter') {
      event.preventDefault();
      this.handleInteractionKey();
      return;
    }

    // prevent key-repeat from causing multiple initial presses
    if (this.keysPressed[event.key]) return;
    
    // Mark key as pressed and record the time
    this.keysPressed[event.key] = true;
    this.keyPressedTime[event.key] = Date.now();
    
    if (!this.playerCube) return;

    // Handle movement keys - make initial discrete step
    if (this.movementKeys.includes(event.key)) {
      this.executeMovementStep(event.key);
    }
  };

  private executeMovementStep(key: string): void {
    if (!this.playerCube) return;

    // Get direction from key
    const direction = this.getDirection(key);
    if (!direction) return;

    // Clear auto-movement when user manually moves
    this.targetPosition = undefined;

    const moveAmount = this.stepSize;
    const stepVec = new Vector3(
      direction.x * moveAmount,
      0,
      direction.z * moveAmount
    );

    // Rotate player toward direction
    this.rotatePlayerTowardDirection(direction);

    // Check collision before moving
    const newPos = this.playerCube.position.add(stepVec);
    if (this.canMoveTo(newPos)) {
      this.playerCube.position.addInPlace(stepVec);
    }

    // Play walk animation for this step
    this.playWalk();
  }

  onKeyUp = (event: KeyboardEvent) => {
    this.keysPressed[event.key] = false;
    delete this.keyPressedTime[event.key];
    // Reset accumulator when key is released
    this.keyboardAccumulator = 0;
    // if no movement keys are pressed and no auto-target, go to idle
    const anyMove = this.movementKeys.some((k) => !!this.keysPressed[k]);
    if (!anyMove && !this.targetPosition) {
      // do not schedule idle if a walk animation is currently running
      if (this.isWalking || this.walkLocked) return;
      // small delay to avoid flicker when keys are quickly re-pressed
      if (this.idleTimer) clearTimeout(this.idleTimer);
      this.idleTimer = setTimeout(() => {
        this.playIdle();
        this.idleTimer = null;
      }, 120);
    }
  };

  moveToMeshById(meshId: string) {
    const targetMesh = this.meshes[meshId];
    if (!targetMesh || !this.playerCube) return;
    this.selectedPointId = meshId;
    
    // Calculate approach point: one grid cell away from target mesh in the axis with larger delta
    const deltaX = targetMesh.position.x - this.playerCube.position.x;
    const deltaZ = targetMesh.position.z - this.playerCube.position.z;

    let approachX: number;
    let approachZ: number;

    if (Math.abs(deltaX) > Math.abs(deltaZ)) {
      // Approach along X axis - stop one step away from target
      approachX = targetMesh.position.x - Math.sign(deltaX) * this.stepSize;
      approachZ = this.snapToGrid(targetMesh.position.z);
    } else {
      // Approach along Z axis - stop one step away from target
      approachX = this.snapToGrid(targetMesh.position.x);
      approachZ = targetMesh.position.z - Math.sign(deltaZ) * this.stepSize;
    }

    this.targetPosition = new Vector3(
      this.snapToGrid(approachX),
      this.playerCube.position.y,
      this.snapToGrid(approachZ)
    );
    // auto-move does not trigger walk animation to keep it simple
  }

  private handleInteractionKey(): void {
    if (!this.playerCube) return;

    // Find the closest mesh excluding the player itself
    let closestMesh: any = null;
    let closestDistance = Infinity;
    let closestMeshId: string = '';

    for (const [meshId, mesh] of Object.entries(this.meshes)) {
      if (meshId === 'player' || !mesh) continue;
      const distance = Vector3.Distance(this.playerCube.position, mesh.position);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestMesh = mesh;
        closestMeshId = meshId;
      }
    }

    // If closest mesh is within interaction range, select it
    if (closestMesh && closestDistance <= this.proximityThreshold) {
      this.interactionService.selectMesh(closestMeshId);
    }
  }


  private stopAllAnimations(): void {
    if (!this.animationGroups) return;
    // remove walk end observer if present
    if (this.walkEndObserver && this.walkAnimation && (this.walkAnimation as any).onAnimationGroupEndObservable) {
      try { (this.walkAnimation as any).onAnimationGroupEndObservable.remove(this.walkEndObserver); } catch (e) { /* ignore */ }
      this.walkEndObserver = null;
    }
    for (const g of this.animationGroups) {
      try { g.stop(); } catch (e) { /* ignore */ }
    }
  }

  private playIdle(): void {
    // Prefer explicitly detected idleAnimation, fallback to any available animation
    if (!this.animationGroups || this.animationGroups.length === 0) return;
    if (this.isWalking) this.isWalking = false;
    this.stopAllAnimations();
    const toPlay = this.idleAnimation || this.animationGroups[0];
    try {
      toPlay.start(true);
    } catch (e) { /* ignore */ }
  }

  private playWalk(): void {
    if (!this.animationGroups || this.animationGroups.length === 0) return;
    if (this.isWalking) return; // Already walking, don't interrupt
    
    this.isWalking = true;
    this.walkLocked = true;
    this.stopAllAnimations();
    
    const toPlay = this.walkAnimation || this.animationGroups[1] || this.animationGroups[0];
    try {
      // play non-looped to play one complete cycle
      try { toPlay.start(false); } catch (e) { try { toPlay.start(true); } catch (e2) { /*ignore*/ } }
      
      // attach end observer to switch back to idle when walk animation finishes
      if ((toPlay as any).onAnimationGroupEndObservable) {
        // remove previous observer if any
        if (this.walkEndObserver && this.walkAnimation) {
          try { (this.walkAnimation as any).onAnimationGroupEndObservable.remove(this.walkEndObserver); } catch (e) { }
          this.walkEndObserver = null;
        }
        this.walkAnimation = toPlay;
        this.walkEndObserver = (toPlay as any).onAnimationGroupEndObservable.add(() => {
          try { (toPlay as any).stop(); } catch (e) { }
          // Clear flags immediately when animation ends
          this.walkLocked = false;
          this.isWalking = false;
          // Check if any movement keys are still pressed
          const anyMove = this.movementKeys.some((k) => !!this.keysPressed[k]);
          if (!anyMove && !this.targetPosition) {
            // No movement keys pressed, go to idle
            this.playIdle();
          }
        });
      } else {
        // if no end observable, fallback to clearing flags after duration
        setTimeout(() => { 
          this.walkLocked = false; 
          this.isWalking = false; 
          // Check if any movement keys are still pressed
          const anyMove = this.movementKeys.some((k) => !!this.keysPressed[k]);
          if (!anyMove && !this.targetPosition) {
            this.playIdle();
          }
        }, 600);
      }
    } catch (e) { /* ignore */ }
  }
  update(): void {
    if (!this.playerCube || !this.camera) return;
    
    // Handle continuous keyboard movement (if key is held down)
    this.handleContinuousKeyboardMovement();
    
    // Auto-move to targets and camera follow
    const moveSpeed = 0.04; // slower auto-move accumulator increment

    if (this.targetPosition) {
      const distanceToTarget = Vector3.Distance(this.playerCube.position, this.targetPosition);
      // Stop when very close to target (reached proximity for collision)
      if (distanceToTarget <= this.proximityThreshold) {
        const deltaX = this.targetPosition.x - this.playerCube.position.x;
        const deltaZ = this.targetPosition.z - this.playerCube.position.z;
        
        // Move to align on one axis, then snap to grid
        if (Math.abs(deltaX) > 0.1 || Math.abs(deltaZ) > 0.1) {
          let stepVec: Vector3;
          if (Math.abs(deltaX) > Math.abs(deltaZ)) {
            // Move remaining distance on X axis and snap to grid
            const snappedX = this.snapToGrid(this.playerCube.position.x + deltaX);
            const moveX = snappedX - this.playerCube.position.x;
            stepVec = new Vector3(moveX, 0, 0);
          } else {
            // Move remaining distance on Z axis and snap to grid
            const snappedZ = this.snapToGrid(this.playerCube.position.z + deltaZ);
            const moveZ = snappedZ - this.playerCube.position.z;
            stepVec = new Vector3(0, 0, moveZ);
          }
          this.rotatePlayerTowardDirection(stepVec);
          const newPos = this.playerCube.position.add(stepVec);
          if (this.canMoveTo(newPos)) {
            this.playerCube.position = newPos;
          }
        } else {
          // Snap to grid for final alignment
          const snappedPos = new Vector3(
            this.snapToGrid(this.playerCube.position.x),
            this.playerCube.position.y,
            this.snapToGrid(this.playerCube.position.z)
          );
          this.playerCube.position = snappedPos;
        }
        this.targetPosition = undefined;
        // arrived: switch back to idle
        this.playIdle();
      } else if (distanceToTarget > this.proximityThreshold) {
        // accumulate movement distance and make discrete steps
        this.autoMoveAccumulator += moveSpeed;
        if (this.autoMoveAccumulator >= this.autoMoveStepThreshold) {
          // move on one axis at a time (no diagonals) - choose axis with larger distance
          const deltaX = this.targetPosition.x - this.playerCube.position.x;
          const deltaZ = this.targetPosition.z - this.playerCube.position.z;

          let stepVec: Vector3;
          if (Math.abs(deltaX) > Math.abs(deltaZ)) {
            // move on X axis, clamp last step to remaining distance
            const moveAmount = Math.abs(deltaX) < this.stepSize ? deltaX : Math.sign(deltaX) * this.stepSize;
            stepVec = new Vector3(moveAmount, 0, 0);
          } else {
            // move on Z axis, clamp last step to remaining distance
            const moveAmount = Math.abs(deltaZ) < this.stepSize ? deltaZ : Math.sign(deltaZ) * this.stepSize;
            stepVec = new Vector3(0, 0, moveAmount);
          }

          this.rotatePlayerTowardDirection(stepVec);
          const newPos = this.playerCube.position.add(stepVec);
          if (this.canMoveTo(newPos)) {
            this.playerCube.position = newPos;
          }
          this.autoMoveAccumulator = 0;
        }
      }
    }
    else {
      // if not auto-moving and no keys pressed, ensure idle is playing
      const anyKey = Object.values(this.keysPressed).some((v) => v);
      if (!this.targetPosition && !anyKey) {
        const idleGroup = this.idleAnimation || (this.animationGroups && this.animationGroups[0]);
        try {
          if (idleGroup && !(idleGroup as any).isPlaying) {
            this.playIdle();
          }
        } catch (e) {
          // fallback: ensure idle by calling playIdle
          this.playIdle();
        }
      }
    }
    if (this.selectedPointId && this.selectedPointId !== 'player') {
      const targetCube = this.meshes[this.selectedPointId];
      if (targetCube) {
        const distance = Vector3.Distance(this.playerCube.position, targetCube.position);
        if (distance <= this.proximityThreshold) {
          this.interactionService.selectMesh(this.selectedPointId);
        }
      }
    }

    const playerX = this.playerCube.position.x;
    const playerY = this.playerCube.position.y;
    const playerZ = this.playerCube.position.z;
    const cameraY = 15;
    const cameraZOffset = 8;

    this.camera.position = new Vector3(playerX, cameraY, playerZ + cameraZOffset);
    this.camera.target = new Vector3(playerX, playerY + 0.5, playerZ);
  }

  private handleContinuousKeyboardMovement(): void {
    if (!this.playerCube) return;

    // Check if any movement key is pressed
    const activeKeys = this.movementKeys.filter((key) => !!this.keysPressed[key]);
    if (activeKeys.length === 0) {
      // No movement keys pressed
      this.keyboardAccumulator = 0;
      return;
    }

    // Clear auto-movement when user manually moves
    this.targetPosition = undefined;

    // Check if key has been pressed long enough for continuous movement
    const currentKey = activeKeys[0];
    const timePressedMs = Date.now() - (this.keyPressedTime[currentKey] || Date.now());
    
    // Only do continuous movement if key has been held for more than the initial delay
    if (timePressedMs < this.keyboardStepDelay * 1000) {
      // Still in initial press phase - wait for continuous movement trigger
      return;
    }

    // Accumulate time for continuous movement
    this.keyboardAccumulator += 0.016; // ~60fps: 16ms per frame

    // When accumulator reaches threshold, execute a step
    if (this.keyboardAccumulator >= this.keyboardStepDelay) {
      // Process the first/priority active key
      const key = activeKeys[0];
      const direction = this.getDirection(key);
      
      if (direction) {
        const moveAmount = this.stepSize;
        const stepVec = new Vector3(
          direction.x * moveAmount,
          0,
          direction.z * moveAmount
        );

        // Rotate player toward direction
        this.rotatePlayerTowardDirection(direction);

        // Play walk animation if not already walking
        if (!this.isWalking && !this.walkLocked) {
          this.playWalk();
        }

        // Check collision before moving
        const newPos = this.playerCube.position.add(stepVec);
        if (this.canMoveTo(newPos)) {
          this.playerCube.position.addInPlace(stepVec);
        }

        // Reset accumulator after step
        this.keyboardAccumulator = 0;
      }
    }
  }
}
