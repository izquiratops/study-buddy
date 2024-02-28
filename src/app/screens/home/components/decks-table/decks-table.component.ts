import { Component } from '@angular/core';
import { HomeService } from '@screens/home/home.service';

@Component({
  selector: 'app-decks-table',
  templateUrl: './decks-table.component.html',
  styleUrl: './decks-table.component.css'
})
export class DecksTableComponent {
  searchText: string;

  constructor(
    private homeService: HomeService,
  ) { }

  get processedDecks$() {
    return this.homeService.processedDecks$;
  }

  handleSearchTextChange(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value;
  }

  async handleDeleteDeck(index: number) {
    this.homeService.removeDeck(index);
  }
}
