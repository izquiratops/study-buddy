import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, filter, switchMap, take } from 'rxjs';
import { StorageService } from '@services/storage.service';
import { ProcessedDecks } from '@models/database.model';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [StorageService, HomeService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  decks$ = new BehaviorSubject<ProcessedDecks>([]);

  constructor(
    private storageService: StorageService,
    private homeService: HomeService) {
  }

  ngOnInit() {
    this.storageService.isReady.pipe(
      filter(isReady => isReady), // Filter only when isReady is true
      take(1), // Stop listening after the first tap
      switchMap(async () => { // Update the subject with the obtained decks from IDB
        const decks = await this.storageService.getDecks();
        return decks.map(this.homeService.getDeckMetadata);
      })) 
    .subscribe(decks => this.decks$.next(decks));
  }

  async handleDeleteDeck(index: number) {
  // Remove from idb
  await this.storageService.deleteDeck(index);
  // Remove from current state. decks$ is not linked to indexedDB updates.
  const decks = this.decks$.getValue();
  const newDecksState = decks.filter(curr => curr.idbKey !== index);
  this.decks$.next(newDecksState);
}
}
