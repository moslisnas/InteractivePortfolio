import { Color3, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from '@babylonjs/core';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF';
import { InteractivePoint } from '../../shared/models/interactive-point.model';
import { DecorationElement } from '../../shared/models/decoration-element.model';

const GRID_SIZE = 1.5;

function snapToGrid(value: number, gridSize: number = GRID_SIZE): number {
  return Math.round(value / gridSize) * gridSize;
}

export function createInteractiveCube(scene: Scene, point: InteractivePoint): Mesh {
  const position = point.position || Vector3.Zero();
  // snap position to grid
  const snappedPosition = new Vector3(
    snapToGrid(position.x),
    position.y,
    snapToGrid(position.z)
  );
  
  const cube = MeshBuilder.CreateBox(point.id, { size: 1.5 }, scene);
  cube.position = snappedPosition;

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

export async function createDecoration(scene: Scene, decoration: DecorationElement): Promise<Mesh | null> {
  const position = decoration.position || Vector3.Zero();
  // snap position to grid
  const snappedPosition = new Vector3(
    snapToGrid(position.x),
    position.y,
    snapToGrid(position.z)
  );

  const modelPath = decoration.mesh;
    
  const result = await SceneLoader.ImportMeshAsync(null, '', modelPath, scene);
  const meshes = result.meshes;

  if (meshes.length === 0) return null;

  // Create an invisible container mesh to hold all loaded meshes
  // Size it to match the scaled size of children (1.5 base * 2.5 scale = 3.75)
  const container = MeshBuilder.CreateBox(decoration.id + '-container', { size: 0.01 }, scene);
  container.name = decoration.id;
  container.position = snappedPosition;

  // Scale the loaded meshes and parent them to container
  for (const mesh of meshes) {
    if (mesh instanceof Mesh) {
      mesh.parent = container;
      mesh.scaling = new Vector3(3, 3, 3);
      mesh.position = Vector3.Zero();
      mesh.checkCollisions = true;
    }
  }
  // Setup collision for container with proper sizing
  container.checkCollisions = true;
  container.ellipsoid = new Vector3(1.0, 1.25, 1.0);
  
  return container;
}

export async function loadCharacterModel(scene: Scene, point: InteractivePoint): Promise<Mesh | null> {
  try {
    const position = point.position || Vector3.Zero();
    const snappedPosition = new Vector3(
      snapToGrid(position.x),
      position.y,
      snapToGrid(position.z)
    );

    const modelPath = '/assets/kenney_mini-characters/Models/GLB format/character-male-f.glb';
    
    const result = await SceneLoader.ImportMeshAsync(null, '', modelPath, scene);
    const meshes = result.meshes;
    const animationGroups = result.animationGroups || [];
    
    if (meshes.length === 0) return null;

    // Create an invisible container mesh to hold all loaded meshes
    // Size it to match the scaled size of children (1.5 base * 2.5 scale = 3.75)
    const container = MeshBuilder.CreateBox(point.id + '-container', { size: 3.75 }, scene);
    container.name = point.id;
    container.position = snappedPosition;
    container.isVisible = false; // Make container invisible

    // Attach animation groups to metadata so controllers can access them
    (container as any).metadata = (container as any).metadata || {};
    (container as any).metadata.animationGroups = animationGroups;

    // Scale the loaded meshes and parent them to container
    for (const mesh of meshes) {
      if (mesh instanceof Mesh) {
        mesh.parent = container;
        mesh.scaling = new Vector3(2.5, 2.5, 2.5);
        mesh.position = Vector3.Zero();
        mesh.checkCollisions = true;
      }
    }

    // Setup collision for container with proper sizing
    container.checkCollisions = true;
    container.ellipsoid = new Vector3(1.0, 1.25, 1.0);
    
    return container;
  } catch (error) {
    console.error('Error loading character model:', error);
    return null;
  }
}
