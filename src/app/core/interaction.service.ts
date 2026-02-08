import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Scene } from '@babylonjs/core/scene';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';

export interface PickInfo {
  mesh: AbstractMesh | null;
  pointId: string;
}

@Injectable({ providedIn: 'root' })
export class InteractionService {
  private pickSubject = new Subject<PickInfo>();
  public pick$ = this.pickSubject.asObservable();

  private scene?: Scene;
  private interactiveMeshes: Map<string, AbstractMesh> = new Map();

  setScene(scene: Scene): void {
    this.scene = scene;
  }

  registerMesh(pointId: string, mesh: AbstractMesh): void {
    this.interactiveMeshes.set(pointId, mesh);
  }

  registerPointerObservable(): void {
    if (!this.scene) return;

    this.scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type === 1) {
        // PointerEventTypes.POINTERTAP
        const pickResult = this.scene!.pick(
          this.scene!.pointerX,
          this.scene!.pointerY
        );

        if (pickResult?.hit && pickResult.pickedMesh) {
          const pointId = this.findPointIdByMesh(pickResult.pickedMesh);
          if (pointId) {
            this.pickSubject.next({
              mesh: pickResult.pickedMesh,
              pointId,
            });
          }
        }
      }
    });
  }

  private findPointIdByMesh(mesh: AbstractMesh): string | null {
    for (const [pointId, registeredMesh] of this.interactiveMeshes) {
      if (registeredMesh === mesh) {
        return pointId;
      }
    }
    return null;
  }

  getInteractiveMeshes(): Map<string, AbstractMesh> {
    return this.interactiveMeshes;
  }
}
