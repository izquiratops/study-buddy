import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProcessedDecks } from '@models/database.model';
import { StorageService } from '@services/storage.service';

@Component({
  selector: 'app-decks-table',
  templateUrl: './decks-table.component.html',
})
export class DecksTableComponent {
  @Input('items') decks$: BehaviorSubject<ProcessedDecks>;
  searchText: string;

  constructor(private storageService: StorageService) { }

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
