import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder } from '@babylonjs/core';

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

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    this.scene = new Scene(this.engine);

    const camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 4, 6, Vector3.Zero(), this.scene);
    camera.attachControl(canvas, true);

    new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
    MeshBuilder.CreateBox('box', { size: 1 }, this.scene);

    this.engine.runRenderLoop(() => {
      this.scene?.render();
    });

    window.addEventListener('resize', this.onResize);
  }

  private onResize = () => {
    this.engine?.resize();
  };

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
    this.scene?.dispose();
    this.engine?.dispose();
  }
}
