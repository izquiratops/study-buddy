import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from '@services/storage.service';
import { ProcessedDecks } from '@models/database.model';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  searchText: string;
  decks$ = new BehaviorSubject<ProcessedDecks>([]);

  constructor(
    private storageService: StorageService,
    private homeService: HomeService) {
  }

  ngOnInit() {
    this.storageService.onIdbReady.subscribe(async () => {
      const decks = await this.storageService.getDecks();
      const processedDecks = decks.map(this.homeService.getDeckMetadata);

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
