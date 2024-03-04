import { Component } from '@angular/core';
import { HomeService } from './home.service';
import { NavigatorAction } from '@models/editor.model';

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
      callback: () => this.handleThemeClick(),
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

  handleThemeClick() {
    this.homeService.switchTheme();
  }
}
