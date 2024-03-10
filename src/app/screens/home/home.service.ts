import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  firstValueFrom,
  from,
  map,
  switchMap,
  take,
} from 'rxjs';
import { Deck, Decks, ProcessedDeck } from '@models/database.model';
import { StorageService } from '@services/storage.service';
import { DataThemeValue } from '@models/editor.model';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  // 🔎 Current search input value
  searchText: string = '';
  // 🌙 Dark theme preference
  dataThemeValue = document.documentElement.getAttribute(
    'data-theme'
  ) as DataThemeValue;

  // 🎴 Deck list from the current local database
  readonly decks$ = new BehaviorSubject<Decks>([]);
  // 🎴 Boolean that tells if the current list has cards
  readonly hasItems$ = this.decks$.pipe(map((decks) => decks.length > 0));
  // 🔧 Deck list again, with extra info to show on UI
  readonly processedDecks$ = from(this.decks$).pipe(
    map((deck) => deck.map(this._mapDecks))
  );

  constructor(private storageService: StorageService) {}

  // TODO: Deprecate this map, this is not used on UI anymore
  private _mapDecks(deck: Deck): ProcessedDeck {
    return {
      ...deck,
      toBeReviewedCount: deck.cards.reduce((acc, curr) => {
        if (curr.fsrsCard.due < new Date()) {
          return acc + 1;
        } else {
          return acc;
        }
      }, 0),
    };
  }

  async initializeDeckList() {
    const decks = await firstValueFrom(
      this.storageService.onIdbReady$.pipe(
        filter((value) => value),
        switchMap(() => this.storageService.getDecks())
      )
    );

    this.decks$.next(decks);
  }

  // TODO: Set this value with persistance
  switchTheme() {
    if (this.dataThemeValue === 'light') {
      document.documentElement.setAttribute('data-theme', 'dark');
      this.dataThemeValue = 'dark';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      this.dataThemeValue = 'light';
    }
  }

  async removeDeck(index: number) {
    // Remove from idb
    await this.storageService.deleteDeck(index);

    // Remove from current state. decks$ is not linked to indexedDB updates.
    const currDecksState = this.decks$.getValue();
    const newDecksState = currDecksState.filter(
      (curr) => curr.idbKey !== index
    );

    this.decks$.next(newDecksState);
  }
}
