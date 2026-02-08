import { Color3, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from '@babylonjs/core';
import { InteractivePoint } from '../../shared/models/interactive-point.model';

export function createInteractiveCube(scene: Scene, point: InteractivePoint): Mesh {
  const position = point.position || Vector3.Zero();
  const cube = MeshBuilder.CreateBox(point.id, { size: 1.5 }, scene);
  cube.position = new Vector3(position.x, position.y, position.z);

  const material = new StandardMaterial('material-' + point.id, scene);
  const color = point.color || { r: 1, g: 1, b: 1 };
  material.emissiveColor = new Color3(color.r * 0.6, color.g * 0.6, color.b * 0.6);
  material.specularColor = new Color3(0.8, 0.8, 0.8);
  material.specularPower = 32;
  cube.material = material;

  // enable collisions for this mesh so player movement respects it
  cube.checkCollisions = true;

  return cube;
}
