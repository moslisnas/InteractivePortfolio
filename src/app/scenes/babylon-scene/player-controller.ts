import { ArcRotateCamera, Mesh, Vector3 } from '@babylonjs/core';
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

  setMeshes(meshes: { [key: string]: any }) {
    this.meshes = meshes;
  }

  attachPlayer(mesh: Mesh) {
    this.playerCube = mesh;
    // enable collisions and set an ellipsoid for smoother collision behavior
    this.playerCube.checkCollisions = true;
    this.playerCube.ellipsoid = new Vector3(0.75, 0.75, 0.75);
    // snap to grid to ensure correct alignment
    this.playerCube.position = new Vector3(
      this.snapToGrid(this.playerCube.position.x),
      this.playerCube.position.y,
      this.snapToGrid(this.playerCube.position.z)
    );
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
      // perform a single discrete move with collisions
      this.playerCube.moveWithCollisions(stepVec);
    }
  };

  onKeyUp = (event: KeyboardEvent) => {
    this.keysPressed[event.key] = false;
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
          this.playerCube.moveWithCollisions(stepVec);
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

          this.playerCube.moveWithCollisions(stepVec);
          this.autoMoveAccumulator = 0;
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
