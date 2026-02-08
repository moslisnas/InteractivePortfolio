import { Component, signal } from '@angular/core';
import { BabylonSceneComponent } from './scenes/babylon-scene/babylon-scene.component';

@Component({
  selector: 'app-root',
  imports: [BabylonSceneComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('interactive-portfolio');
}
