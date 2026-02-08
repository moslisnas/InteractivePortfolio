import { Injectable } from '@angular/core';
import { Scene } from '@babylonjs/core/scene';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';

@Injectable({ providedIn: 'root' })
export class AssetLoaderService {
  async loadModel(scene: Scene, rootUrl: string, filename: string) {
    const result = await SceneLoader.ImportMeshAsync('', rootUrl, filename, scene);
    return result;
  }
}
