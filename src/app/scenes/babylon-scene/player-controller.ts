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

  private canMoveTo(newPosition: Vector3): boolean {
    if (!this.playerCube) return false;

    const collisionRadius = 0.9; // Approximate radius to check for collisions

    // Check collision with all meshes except player
    for (const [meshId, mesh] of Object.entries(this.meshes)) {
      if (meshId === 'player' || !mesh) continue;

      const distance = Vector3.Distance(newPosition, mesh.position);
      // If distance is less than sum of collision radii, there would be collision
      // Use 1.5 as approximate size of other objects
      if (distance < collisionRadius + 0.75) {
        return false; // Collision detected
      }
    }

    return true; // No collision
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
      // fallbacks
      if (!this.idleAnimation && this.animationGroups.length > 0) this.idleAnimation = this.animationGroups[0];
      if (!this.walkAnimation && this.animationGroups.length > 1) this.walkAnimation = this.animationGroups[1];
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

    // prevent key-repeat from causing multiple moves while holding
    if (this.keysPressed[event.key]) return;
    this.keysPressed[event.key] = true;

    if (!this.playerCube) return;

    let stepVec: Vector3 | undefined;
    const s = this.stepSize;
    switch (event.key) {
      case 'ArrowUp':
        stepVec = new Vector3(0, 0, -s);
        break;
      case 'ArrowDown':
        stepVec = new Vector3(0, 0, s);
        break;
      case 'ArrowLeft':
        stepVec = new Vector3(s, 0, 0);
        break;
      case 'ArrowRight':
        stepVec = new Vector3(-s, 0, 0);
        break;
      default:
        break;
    }

    if (stepVec) {
      // clear auto-movement when user manually moves
      this.targetPosition = undefined;
      // start walk animation (one full cycle) and clear any pending idle timer
      this.playWalk();
      if (this.idleTimer) {
        clearTimeout(this.idleTimer);
        this.idleTimer = null;
      }
      // rotate player to face movement direction
      this.rotatePlayerTowardDirection(stepVec);
      // check for collision and move if safe
      const newPos = this.playerCube.position.add(stepVec);
      if (this.canMoveTo(newPos)) {
        this.playerCube.position = newPos;
      }
      // (no idle scheduling here) avoid interrupting a full walk animation
    }
  };

  onKeyUp = (event: KeyboardEvent) => {
    this.keysPressed[event.key] = false;
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
    if (this.isWalking) return;
    this.isWalking = true;
    this.walkLocked = true;
    this.stopAllAnimations();
    const toPlay = this.walkAnimation || this.animationGroups[1] || this.animationGroups[0];
    try {
      // play non-looped to ensure it reaches its end
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
          // slight delay to allow skeleton to settle, then play idle
          setTimeout(() => {
            this.walkLocked = false;
            this.isWalking = false;
            this.playIdle();
          }, 25);
        });
      } else {
        // if no end observable, fallback to clearing flags after duration estimated from range
        // (best-effort) clear lock after 600ms
        setTimeout(() => { this.walkLocked = false; this.isWalking = false; this.playIdle(); }, 600);
      }
    } catch (e) { /* ignore */ }
  }
  update(): void {
    if (!this.playerCube || !this.camera) return;
    // discrete keyboard movement handled in onKeyDown; update() handles auto-move and camera follow
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
}
