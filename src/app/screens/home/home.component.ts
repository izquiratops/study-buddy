import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HomeService } from '@services';
import { NavigatorAction, ThemeColorKeys } from '@models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  loadingDecks$ = new BehaviorSubject(true);
  navigatorActions: Array<NavigatorAction> = [
    {
      type: 'Method',
      label: 'Hue 🌈',
      callback: () => this.handleRandomHue(),
    },
    {
      type: 'Link',
      label: 'Add Deck ✒️',
      routerLink: '/editor',
    },
  ];

  constructor(public homeService: HomeService) {}

  ngOnInit() {
    this.homeService
      .initializeHome()
      .then((decks) => {
        this.homeService.decks$.next(decks);
      })
      .finally(() => {
        this.loadingDecks$.next(false);
      });
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
