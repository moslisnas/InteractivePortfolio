import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Engine, Scene, ArcRotateCamera, Mesh, Vector3 } from '@babylonjs/core';
import { PortfolioDataService } from '../../core/portfolio-data.service';
import { InteractionService } from '../../core/interaction.service';
import { InteractivePoint } from '../../shared/models/interactive-point.model';
import { SceneBuilder } from './scene-builder';
import { loadCharacterModel } from './mesh-factory';
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
    this.portfolioDataService.loadDataPoints().subscribe((points) => {
      console.log('Portfolio data points loaded:', points);
      this.portfolioPoints = points;
      this.createInteractiveCubes();
    });
    
    // Decorations disabled for minimal scene (we only want the player centered)
  }

  private createInteractiveCubes(): void {
    if (!this.scene) return;
    // Only create the player and place it at the world origin
    console.log('Creating only the player mesh');
    const playerPoint = this.portfolioPoints.find((p) => p.id === 'player');
    if (!playerPoint) {
      console.warn('No player point found in portfolio data');
      return;
    }

    (async () => {
      const mesh = await loadCharacterModel(this.scene!, playerPoint);
      if (mesh) {
        mesh.position = new Vector3(0, 0, 0);
        console.log('Created player mesh at', mesh.position);
        this.interactionService.registerMesh(playerPoint.id, mesh);
        this.meshes[playerPoint.id] = mesh;
        this.playerController?.attachPlayer(mesh);
      }
    })();
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
