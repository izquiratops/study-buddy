import { Component } from '@angular/core';
import { BehaviorSubject, filter, switchMap, take } from 'rxjs';
import { StorageService } from '@services/storage.service';
import { Decks } from '@models/database.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  decks$ = new BehaviorSubject<Decks>([]);

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    // Fetch decks when idb is ready
    this.storageService.onIdbReady$.pipe(
      filter(value => value),
      switchMap(() => this.storageService.getDecks()),
      take(1),
    ).subscribe({
      next: decks => this.decks$.next(decks),
      error: err => console.error(err)
    });
  }
}
