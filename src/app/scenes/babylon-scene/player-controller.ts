import { ArcRotateCamera, Mesh, Vector3 } from '@babylonjs/core';
import { InteractionService } from '../../core/interaction.service';

export class PlayerController {
  private playerCube?: Mesh;
  private camera?: ArcRotateCamera;
  private keysPressed: { [key: string]: boolean } = {};
  private targetPosition?: Vector3;
  private selectedPointId?: string;
  private meshes: { [key: string]: any } = {};
  private proximityThreshold = 1.5;
  private stepSize = 1.5; // single-step equals cube size

  constructor(private interactionService: InteractionService) {}

  setMeshes(meshes: { [key: string]: any }) {
    this.meshes = meshes;
  }

  attachPlayer(mesh: Mesh) {
    this.playerCube = mesh;
    // enable collisions and set an ellipsoid for smoother collision behavior
    this.playerCube.checkCollisions = true;
    this.playerCube.ellipsoid = new Vector3(0.75, 0.75, 0.75);
  }

  attachCamera(cam: ArcRotateCamera) {
    this.camera = cam;
  }

  onKeyDown = (event: KeyboardEvent) => {
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
    const direction = targetMesh.position.subtract(this.playerCube.position).normalize();
    this.targetPosition = targetMesh.position.subtract(direction.scale(1.2));
  }

  update(): void {
    if (!this.playerCube || !this.camera) return;
    // discrete keyboard movement handled in onKeyDown; update() handles auto-move and camera follow
    const moveSpeed = 0.1;

    if (this.targetPosition) {
      const distanceToTarget = Vector3.Distance(this.playerCube.position, this.targetPosition);
      if (distanceToTarget > 0.1) {
        const direction = this.targetPosition.subtract(this.playerCube.position).normalize();
        this.playerCube.moveWithCollisions(direction.scale(moveSpeed * 2));
      } else {
        this.targetPosition = undefined;
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
