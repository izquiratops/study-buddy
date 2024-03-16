import { Component, HostListener, Input, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NavigatorAction } from '@models';

@Component({
  selector: 'app-navigator-bar',
  templateUrl: './navigator-bar.component.html',
  styleUrl: './navigator-bar.component.css',
})
export class NavigatorBarComponent {
  // '768px' is the value of the second smallest media query from PicoCSS.
  private readonly pixelThreshold = 768;

  @Input() title: string;
  @Input() actions: Array<NavigatorAction>;

  enableMobileLayout = new BehaviorSubject<Boolean>(false);

  private onWindowResize() {
    this.enableMobileLayout.next(this.pixelThreshold > window.innerWidth);
  }

  ngOnInit() {
    this.onWindowResize();
  }

  ngDoCheck() {
    console.debug('do check');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.debug('changes', changes);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.onWindowResize();
  }
}
