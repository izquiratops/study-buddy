import { Pipe, PipeTransform } from '@angular/core';
import { Deck, Decks, ProcessedDeck, ProcessedDecks } from '@models/database.model';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Pipe({
  name: 'mapDeckData',
})
export class MapDeckDataPipe implements PipeTransform {

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

  transform(value: BehaviorSubject<Decks>): BehaviorSubject<ProcessedDecks> {
    const decks = new BehaviorSubject<ProcessedDecks>([]);

    value.pipe(
      map(deck => deck.map(this._mapDecks))
    ).subscribe({
      next: deck => decks.next(deck)
    });

    return decks;
  }

}
