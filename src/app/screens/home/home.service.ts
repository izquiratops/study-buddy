import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, from, map, switchMap } from 'rxjs';
import { Deck, Decks, ProcessedDeck } from '@models/database.model';
import { StorageService } from '@services/storage.service';
import { DataThemeValue } from '@models/editor.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  dataThemeValue = document.documentElement.getAttribute('data-theme') as DataThemeValue;

  readonly decks$ = new BehaviorSubject<Decks>([]);
  readonly processedDecks$ = from(this.decks$).pipe(
    map(deck => deck.map(this._mapDecks))
  )

  constructor(private storageService: StorageService) { }

  private _mapDecks(deck: Deck): ProcessedDeck {
    return {
      ...deck,
      toBeReviewedCount: deck.cards.reduce((acc, curr) => {
        if (curr.fsrsCard.due < new Date()) {
          return acc + 1;
        } else {
          return acc;
        }
      }, 0)
    }
  };

  loadDecks() {
    this.storageService.onIdbReady$.pipe(
      filter(value => value),
      switchMap(() => this.storageService.getDecks()),
    ).subscribe({
      next: decks => this.decks$.next(decks),
      error: err => console.error(err)
    });
  }

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
    const newDecksState = currDecksState.filter(curr => curr.idbKey !== index);
    this.decks$.next(newDecksState);
  }
}
