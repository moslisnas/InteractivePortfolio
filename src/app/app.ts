import { Component, signal } from '@angular/core';
import { BabylonSceneComponent } from './scenes/babylon-scene/babylon-scene.component';
import { InfoPanelComponent } from './ui/info-panel/info-panel.component';

@Component({
  selector: 'app-root',
  imports: [BabylonSceneComponent, InfoPanelComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('interactive-portfolio');
}
