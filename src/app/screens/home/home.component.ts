import { Component } from '@angular/core';
import { HomeService } from './home.service';
import { NavigatorAction, ThemeColorKeys } from '@models/editor.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  navigatorActions: Array<NavigatorAction> = [
    {
      type: 'Link',
      label:
        this.homeService.dataThemeValue === 'light'
          ? 'Darken 🌑'
          : 'Enlighten ☀️',
      routerLink: '.',
      callback: () => this.homeService.switchTheme(),
    },
    {
      type: 'Method',
      label: 'Random Hue 🌈',
      callback: () => this.handleRandomHue(),
    },
    {
      type: 'Link',
      label: 'Add Deck ✒️',
      routerLink: '/editor',
    },
  ];

  constructor(private homeService: HomeService) {}

  ngOnInit() {
    this.homeService.initializeDeckList();
  }

  get hasItems$() {
    return this.homeService.hasItems$;
  }

  onSearchTextChange(event: Event) {
    this.homeService.searchText = (event.target as HTMLInputElement).value;
  }

  handleRandomHue() {
    const index = Math.floor(Math.random() * ThemeColorKeys.length);
    const color = ThemeColorKeys[index].toLowerCase();
    const link = document.getElementById('hue');
    link?.setAttribute(
      'href',
      `https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.${color}.min.css`
    );
  }
}
