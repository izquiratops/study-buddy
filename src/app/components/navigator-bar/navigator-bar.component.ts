import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navigator-bar',
  templateUrl: './navigator-bar.component.html',
})
export class NavigatorBarComponent {
  @Input() title: string;
}
