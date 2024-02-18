import { Component } from '@angular/core';
import { BehaviorSubject, concatMap, map } from 'rxjs';
import { StorageService } from '@services/storage.service';
import { Deck, ProcessedDeck, ProcessedDecks } from '@models/database.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  searchText: string;
  decks$ = new BehaviorSubject<ProcessedDecks>([]);

  constructor(private storageService: StorageService) {
  }

  private _getDeckMetadata(deck: Deck): ProcessedDeck {
    return {
      ...deck,
      toBeReviewedCount: deck.flashCards.reduce((acc, curr) => {
        if (curr.card.due < new Date()) {
          return acc + 1;
        } else {
          return acc;
        }
      }, 0)
    }
  };

  ngOnInit() {
    this.storageService.onIdbReady$.pipe(
      concatMap(async () => await this.storageService.getDecks()),
      map(deck => deck.map(this._getDeckMetadata))
    ).subscribe((processedDecks) => {
      this.decks$.next(processedDecks);
    });
  }

  handleSearchTextChange(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value;
  }

  async handleDeleteDeck(index: number) {
    // Remove from idb
    await this.storageService.deleteDeck(index);

    // Remove from current state. decks$ is not linked to indexedDB updates.
    const currDecksState = this.decks$.getValue();
    const newDecksState = currDecksState.filter(curr => curr.idbKey !== index);
    this.decks$.next(newDecksState);
  }
}
