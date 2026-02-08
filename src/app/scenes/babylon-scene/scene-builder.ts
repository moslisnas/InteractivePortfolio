import { ArcRotateCamera, Color3, HemisphericLight, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from '@babylonjs/core';
import { InteractionService } from '../../core/interaction.service';

export class SceneBuilder {
  static setupScene(scene: Scene, canvas: HTMLCanvasElement, interactionService: InteractionService) {
    // Camera
    const camera = new ArcRotateCamera('camera', 0, Math.PI / 4, 1, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.inputs.clear();
    camera.position = new Vector3(0, 8, 8);

    // Lights
    const ambientLight = new HemisphericLight('ambientLight', new Vector3(0.5, 1, 0.5), scene);
    ambientLight.intensity = 0.4;
    ambientLight.groundColor = new Color3(0.15, 0.15, 0.2);

    const fillLight = new HemisphericLight('fillLight', new Vector3(-0.5, -1, -0.5), scene);
    fillLight.intensity = 0.2;

    scene.collisionsEnabled = true;

    // Ground
    const ground = MeshBuilder.CreateGround('ground', { width: 150, height: 150 }, scene);
    const groundMaterial = new StandardMaterial('groundMat', scene);
    groundMaterial.emissiveColor = new Color3(0.3, 0.3, 0.35);
    ground.material = groundMaterial;
    ground.position.y = -1.5;

    // Guides (axis)
    const guideObjects: Mesh[] = [];
    const axisSize = 3;

    const xLine = MeshBuilder.CreateTube('xAxis', { path: [Vector3.Zero(), new Vector3(axisSize, 0, 0)], radius: 0.05 }, scene);
    const xMat = new StandardMaterial('xMat', scene);
    xMat.emissiveColor = new Color3(1, 0, 0);
    xLine.material = xMat;
    guideObjects.push(xLine);

    const yLine = MeshBuilder.CreateTube('yAxis', { path: [Vector3.Zero(), new Vector3(0, axisSize, 0)], radius: 0.05 }, scene);
    const yMat = new StandardMaterial('yMat', scene);
    yMat.emissiveColor = new Color3(0, 1, 0);
    yLine.material = yMat;
    guideObjects.push(yLine);

    const zLine = MeshBuilder.CreateTube('zAxis', { path: [Vector3.Zero(), new Vector3(0, 0, axisSize)], radius: 0.05 }, scene);
    const zMat = new StandardMaterial('zMat', scene);
    zMat.emissiveColor = new Color3(0, 0, 1);
    zLine.material = zMat;
    guideObjects.push(zLine);

    interactionService.setScene(scene);
    interactionService.registerPointerObservable();

    return { camera, guideObjects };
  }
}
