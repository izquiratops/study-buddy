import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, filter, take, tap } from 'rxjs';
import { StorageService } from '@services/storage.service';
import { Decks } from '@models/database.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [StorageService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  decks = new BehaviorSubject<Decks>([]);

  constructor(public storageService: StorageService) {
  }

  ngOnInit() {
    this.storageService.isReady.pipe(
      filter(isReady => isReady), // Filter only when isReady is true
      tap(() => { // Update the subject with the obtained decks from IDB
        console.debug('Loading decks from local database');
        this.storageService.getDecks().then(decks => {
          this.decks.next(decks)
        });
      }),
      take(1)) // Stop listening after the first tap
    .subscribe();
  }

  handleDeckClick() {
  }

}
