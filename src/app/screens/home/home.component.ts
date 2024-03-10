import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HomeService } from '@services';
import { NavigatorAction } from '@models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  loadingDecks$ = new BehaviorSubject(true);
  navigatorActions: Array<NavigatorAction> = [
    {
      type: 'Method',
      label: 'Theme 🌑',
      callback: () => {
        this.homeService.switchTheme();
      },
      class: 'outline',
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
}
