import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3, DynamicTexture, GroundMesh, Mesh } from '@babylonjs/core';
import { PortfolioDataService } from '../../core/portfolio-data.service';
import { InteractionService } from '../../core/interaction.service';
import { InteractivePoint } from '../../shared/models/interactive-point.model';

@Component({
  selector: 'app-babylon-scene',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './babylon-scene.component.html',
  styleUrls: ['./babylon-scene.component.scss']
})
export class BabylonSceneComponent implements AfterViewInit, OnDestroy {
  @ViewChild('renderCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private engine?: Engine;
  private scene?: Scene;
  private camera?: ArcRotateCamera;
  private portfolioPoints: InteractivePoint[] = [];
  private playerSphere?: any;
  private keysPressed: { [key: string]: boolean } = {};
  showGuides = true;
  private guideObjects: Mesh[] = [];

  constructor(
    private portfolioDataService: PortfolioDataService,
    private interactionService: InteractionService
  ) {}

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    this.scene = new Scene(this.engine);

    this.setupScene(canvas);
    this.loadPortfolioData();

    this.engine.runRenderLoop(() => {
      this.updatePlayerMovement();
      this.scene?.render();
    });

    window.addEventListener('resize', this.onResize);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  private setupScene(canvas: HTMLCanvasElement): void {
    if (!this.scene) return;

    // Initialize camera with proper positioning
    this.camera = new ArcRotateCamera('camera', 0, Math.PI / 4, 1, Vector3.Zero(), this.scene);
    this.camera.attachControl(canvas, true);
    this.camera.inputs.clear();
    // Initial camera position to see the scene (positive Z side)
    this.camera.position = new Vector3(0, 8, 8);

    // Reduced lighting
    const ambientLight = new HemisphericLight('ambientLight', new Vector3(0.5, 1, 0.5), this.scene);
    ambientLight.intensity = 0.4;
    ambientLight.groundColor = new Color3(0.15, 0.15, 0.2);
    
    const fillLight = new HemisphericLight('fillLight', new Vector3(-0.5, -1, -0.5), this.scene);
    fillLight.intensity = 0.2;
    
    this.scene.collisionsEnabled = true;

    // Add ground plane (always visible, not part of guides toggle)
    const ground = MeshBuilder.CreateGround('ground', { width: 150, height: 150 }, this.scene);
    const groundMaterial = new StandardMaterial('groundMat', this.scene);
    groundMaterial.emissiveColor = new Color3(0.3, 0.3, 0.35);
    ground.material = groundMaterial;
    ground.position.y = -1.5;

    // Create axis guides
    const axisSize = 3;
    
    // X axis (red)
    const xLine = MeshBuilder.CreateTube('xAxis', { path: [Vector3.Zero(), new Vector3(axisSize, 0, 0)], radius: 0.05 }, this.scene);
    const xMat = new StandardMaterial('xMat', this.scene);
    xMat.emissiveColor = new Color3(1, 0, 0);
    xLine.material = xMat;
    this.guideObjects.push(xLine);
    
    // Y axis (green)
    const yLine = MeshBuilder.CreateTube('yAxis', { path: [Vector3.Zero(), new Vector3(0, axisSize, 0)], radius: 0.05 }, this.scene);
    const yMat = new StandardMaterial('yMat', this.scene);
    yMat.emissiveColor = new Color3(0, 1, 0);
    yLine.material = yMat;
    this.guideObjects.push(yLine);
    
    // Z axis (blue)
    const zLine = MeshBuilder.CreateTube('zAxis', { path: [Vector3.Zero(), new Vector3(0, 0, axisSize)], radius: 0.05 }, this.scene);
    const zMat = new StandardMaterial('zMat', this.scene);
    zMat.emissiveColor = new Color3(0, 0, 1);
    zLine.material = zMat;
    this.guideObjects.push(zLine);

    this.interactionService.setScene(this.scene);
    this.interactionService.registerPointerObservable();
  }

  private loadPortfolioData(): void {
    this.portfolioDataService.loadData().subscribe((points) => {
      console.log('Portfolio data loaded:', points);
      this.portfolioPoints = points;
      this.createInteractiveSpheres();
    });
  }

  private createInteractiveSpheres(): void {
    if (!this.scene) return;

    console.log('Creating spheres for', this.portfolioPoints.length, 'points');
    this.portfolioPoints.forEach((point) => {
      const position = point.position || Vector3.Zero();
      const sphere = MeshBuilder.CreateSphere(point.id, { diameter: 1.6, segments: 16 }, this.scene);
      sphere.position = new Vector3(position.x, position.y, position.z);

      const material = new StandardMaterial('material-' + point.id, this.scene);
      const color = point.color || { r: 1, g: 1, b: 1 };
      material.emissiveColor = new Color3(color.r * 0.6, color.g * 0.6, color.b * 0.6);
      material.specularColor = new Color3(0.8, 0.8, 0.8);
      material.specularPower = 32;
      sphere.material = material;

      console.log('Created sphere', point.id, 'at', position);
      this.interactionService.registerMesh(point.id, sphere);

      // Store reference to player sphere
      if (point.id === 'player') {
        this.playerSphere = sphere;
      }
    });
  }

  private updatePlayerMovement(): void {
    if (!this.playerSphere || !this.camera) return;

    const moveSpeed = 0.1;
    // Movement controls
    if (this.keysPressed['ArrowUp']) {
      this.playerSphere.position.z -= moveSpeed;
    }
    if (this.keysPressed['ArrowDown']) {
      this.playerSphere.position.z += moveSpeed;
    }
    if (this.keysPressed['ArrowLeft']) {
      this.playerSphere.position.x += moveSpeed;
    }
    if (this.keysPressed['ArrowRight']) {
      this.playerSphere.position.x -= moveSpeed;
    }

    // Camera positioned parallel to X axis, following the player
    const playerX = this.playerSphere.position.x;
    const playerY = this.playerSphere.position.y;
    const playerZ = this.playerSphere.position.z;
    const cameraY = 15;
    const cameraZOffset = 8;
    
    this.camera.position = new Vector3(playerX, cameraY, playerZ + cameraZOffset);
    this.camera.target = new Vector3(playerX, playerY + 0.5, playerZ);
  }

  toggleGuides(): void {
    this.showGuides = !this.showGuides;
    this.guideObjects.forEach((obj) => {
      obj.isVisible = this.showGuides;
    });
  }

  private onKeyDown = (event: KeyboardEvent) => {
    this.keysPressed[event.key] = true;
  };

  private onKeyUp = (event: KeyboardEvent) => {
    this.keysPressed[event.key] = false;
  };

  private onResize = () => {
    this.engine?.resize();
  };

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.scene?.dispose();
    this.engine?.dispose();
  }
}
