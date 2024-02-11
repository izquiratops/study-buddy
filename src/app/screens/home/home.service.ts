import { Injectable } from '@angular/core';
import { Deck, ProcessedDeck } from '@models/database.model';

@Injectable()
export class HomeService {

  constructor() { }

  // TODO: Rename along ProcessedDeck
  getDeckMetadata(deck: Deck): ProcessedDeck {
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
}
