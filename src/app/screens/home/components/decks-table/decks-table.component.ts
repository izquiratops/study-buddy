import { Component } from '@angular/core';
import { HomeService } from 'app/services/home.service';

@Component({
  selector: 'app-decks-table',
  templateUrl: './decks-table.component.html',
  styleUrl: './decks-table.component.css',
})
export class DecksTableComponent {
  constructor(private homeService: HomeService) {}

  get processedDecks$() {
    return this.homeService.processedDecks$;
  }

  get searchText() {
    return this.homeService.searchText;
  }
}
