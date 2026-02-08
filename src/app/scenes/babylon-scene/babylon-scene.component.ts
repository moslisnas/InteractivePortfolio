import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Engine, Scene, ArcRotateCamera, Mesh, Vector3 } from '@babylonjs/core';
import { PortfolioDataService } from '../../core/portfolio-data.service';
import { InteractionService } from '../../core/interaction.service';
import { InteractivePoint } from '../../shared/models/interactive-point.model';
import { SceneBuilder } from './scene-builder';
import { createInteractiveCube } from './mesh-factory';
import { PlayerController } from './player-controller';

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
  private portfolioPoints: InteractivePoint[] = [];
  showGuides = false;
  private guideObjects: Mesh[] = [];
  private meshes: { [key: string]: any } = {};
  private playerController?: PlayerController;

  constructor(
    private portfolioDataService: PortfolioDataService,
    private interactionService: InteractionService
  ) {}

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    this.scene = new Scene(this.engine);
    const { camera, guideObjects } = SceneBuilder.setupScene(this.scene, canvas, this.interactionService);
    this.guideObjects = guideObjects;
    // apply initial visibility based on default
    this.guideObjects.forEach((g) => (g.isVisible = this.showGuides));

    this.playerController = new PlayerController(this.interactionService);
    this.playerController.attachCamera(camera);
    this.playerController.setMeshes(this.meshes);

    this.loadPortfolioData();

    this.engine.runRenderLoop(() => {
      this.playerController?.update();
      this.scene?.render();
    });

    window.addEventListener('resize', this.onResize);
    window.addEventListener('keydown', this.playerController.onKeyDown);
    window.addEventListener('keyup', this.playerController.onKeyUp);
  }

  // Scene setup is delegated to SceneBuilder

  private loadPortfolioData(): void {
    this.portfolioDataService.loadData().subscribe((points) => {
      console.log('Portfolio data loaded:', points);
      this.portfolioPoints = points;
      this.createInteractiveCubes();
    });
  }

  private createInteractiveCubes(): void {
    if (!this.scene) return;

    console.log('Creating cubes for', this.portfolioPoints.length, 'points');
    this.portfolioPoints.forEach((point) => {
      const cube = createInteractiveCube(this.scene!, point);
      console.log('Created cube', point.id, 'at', cube.position);
      this.interactionService.registerMesh(point.id, cube);
      this.meshes[point.id] = cube;

      if (point.id === 'player') {
        this.playerController?.attachPlayer(cube);
      }
    });

    // pointer handling: move player towards clicked mesh
    this.scene.onPointerDown = () => {
      const pickResult = this.scene?.pick(this.scene.pointerX, this.scene.pointerY);
      if (pickResult?.hit && pickResult.pickedMesh) {
        const meshId = pickResult.pickedMesh.name;
        if (meshId !== 'player' && meshId !== 'ground' && !meshId.startsWith('Tube') && !meshId.startsWith('yAxis') && !meshId.startsWith('xAxis') && !meshId.startsWith('zAxis')) {
          this.playerController?.moveToMeshById(meshId);
        }
      }
    };
  }

  // Movement and camera update delegated to PlayerController

  toggleGuides(): void {
    this.showGuides = !this.showGuides;
    this.guideObjects.forEach((obj) => {
      obj.isVisible = this.showGuides;
    });
  }

  // key handlers are provided by PlayerController

  private onResize = () => {
    this.engine?.resize();
  };

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.playerController?.onKeyDown as EventListener);
    window.removeEventListener('keyup', this.playerController?.onKeyUp as EventListener);
    this.scene?.dispose();
    this.engine?.dispose();
  }
}
