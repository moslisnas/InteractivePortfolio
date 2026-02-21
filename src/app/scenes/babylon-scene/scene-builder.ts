import { ArcRotateCamera, Color3, HemisphericLight, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from '@babylonjs/core';
import { InteractionService } from '../../core/interaction.service';

export class SceneBuilder {
  static setupScene(scene: Scene, canvas: HTMLCanvasElement, interactionService: InteractionService) {
    // Camera - Positioned to view the Career Path journey
    const camera = new ArcRotateCamera('camera', 0, Math.PI / 4, 1, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.inputs.clear();
    camera.position = new Vector3(0, 12, 15);
    camera.inertia = 0.7;
    camera.angularSensibilityX = 1000;
    camera.angularSensibilityY = 1000;

    // Lights - Improved lighting for better visualization
    const ambientLight = new HemisphericLight('ambientLight', new Vector3(0.5, 1, 0.5), scene);
    ambientLight.intensity = 0.5;
    ambientLight.groundColor = new Color3(0.15, 0.15, 0.2);

    const fillLight = new HemisphericLight('fillLight', new Vector3(-0.5, -1, -0.5), scene);
    fillLight.intensity = 0.3;

    scene.collisionsEnabled = true;

    // Create a giant ground plane simulating grass
    const ground = MeshBuilder.CreateGround('ground', { width: 500, height: 500 }, scene);
    const groundMaterial = new StandardMaterial('groundMat', scene);
    groundMaterial.diffuseColor = new Color3(0.2, 0.5, 0.2); // Green grass color
    groundMaterial.specularColor = new Color3(0.1, 0.1, 0.1);
    ground.material = groundMaterial;
    ground.position.y = -1;
    ground.checkCollisions = true;

    // Guide objects (axes) - Optional for development/debugging
    const guideObjects: Mesh[] = [];
    const axisSize = 5;

    // X-axis (Red)
    const xLine = MeshBuilder.CreateTube('xAxis', { path: [Vector3.Zero(), new Vector3(axisSize, 0, 0)], radius: 0.1 }, scene);
    const xMat = new StandardMaterial('xMat', scene);
    xMat.emissiveColor = new Color3(1, 0, 0);
    xLine.material = xMat;
    guideObjects.push(xLine);

    // Y-axis (Green)
    const yLine = MeshBuilder.CreateTube('yAxis', { path: [Vector3.Zero(), new Vector3(0, axisSize, 0)], radius: 0.1 }, scene);
    const yMat = new StandardMaterial('yMat', scene);
    yMat.emissiveColor = new Color3(0, 1, 0);
    yLine.material = yMat;
    guideObjects.push(yLine);

    // Z-axis (Blue)
    const zLine = MeshBuilder.CreateTube('zAxis', { path: [Vector3.Zero(), new Vector3(0, 0, axisSize)], radius: 0.1 }, scene);
    const zMat = new StandardMaterial('zMat', scene);
    zMat.emissiveColor = new Color3(0, 0, 1);
    zLine.material = zMat;
    guideObjects.push(zLine);

    interactionService.setScene(scene);
    interactionService.registerPointerObservable();

    return { camera, guideObjects };
  }
}
