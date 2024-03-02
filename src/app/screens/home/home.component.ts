import { Component } from '@angular/core';
import { Observable, filter, map, switchMap, take } from 'rxjs';
import { StorageService } from '@services/storage.service';
import { HomeService } from './home.service';
import { NavigatorAction } from '@models/editor.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  hasItems$: Observable<boolean>;
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

  constructor(
    private storageService: StorageService,
    private homeService: HomeService
  ) {}

  ngOnInit() {
    this.storageService.onIdbReady$
      .pipe(
        filter((value) => value),
        take(1),
        switchMap(() => this.storageService.getDecks())
      )
      .subscribe({
        next: (decks) => this.homeService.decks$.next(decks),
        error: (err) => console.error(err),
      });

    this.hasItems$ = this.homeService.decks$.pipe(
      map((decks) => decks.length > 0)
    );
  }

  onSearchTextChange(event: Event) {
    this.homeService.searchText = (event.target as HTMLInputElement).value;
  }

  handleThemeClick() {
    this.homeService.switchTheme();
  }
}
