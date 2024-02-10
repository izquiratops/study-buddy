import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, filter, take, tap } from 'rxjs';
import { StorageService } from '@services/storage.service';
import { Decks } from '@models/database.model';
import { GetCardsToReviewCountPipe } from './get-cards-to-review-count.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, GetCardsToReviewCountPipe],
  providers: [StorageService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  decks$ = new BehaviorSubject<Decks>([]);

  constructor(public storageService: StorageService) {
  }

  ngOnInit() {
    this.storageService.isReady.pipe(
      filter(isReady => isReady), // Filter only when isReady is true
      tap(() => { // Update the subject with the obtained decks from IDB
        console.debug('Loading decks from local database');
        this.storageService.getDecks().then(decks => {
          this.decks$.next(decks)
        });
      }),
      take(1)) // Stop listening after the first tap
    .subscribe();
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
