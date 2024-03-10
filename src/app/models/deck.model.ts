import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Card, Cards } from './card.model';

export type DeckForm = FormGroup<DeckFormProps>;

type DeckFormProps = {
  idbKey: FormControl<number>;
  name: FormControl<string>;
  cards: FormArray<FormControl<Card>>;
};

export class Deck {
  idbKey: number;
  name: string;
  cards: Cards;

  constructor(init: Deck) {
    this.idbKey = init.idbKey;
    this.name = init.name;
    this.cards = init.cards.map((curr) => new Card(curr));
  }
}

export type NewDeck = Omit<Deck, 'idbKey'> & { idbKey?: number };

export interface ProcessedDeck extends Deck {
  // TODO: Merge this as a single Deck class
  toBeReviewedCount: number;
}

export type Decks = Array<Deck>;

export type ProcessedDecks = Array<ProcessedDeck>;
