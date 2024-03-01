import { Card as FsrsCard, ReviewLog, createEmptyCard } from 'ts-fsrs';

// Database
export const objectStoreKeys = ['decks'] as const;
export type ObjectStoreKey = (typeof objectStoreKeys)[number];

// Decks
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

// Cards
export type Cards = Array<Card>;
export class Card {
  fsrsCard: FsrsCard;
  content: CardContent;
  log?: ReviewLog; // Logs are empty on new cards

  constructor(init?: Partial<Card>) {
    Object.assign(this, init);

    // Initializes a new card with new FSRS values
    if (this.fsrsCard === undefined) {
      this.clearStats();
    }
  }

  clearStats() {
    this.fsrsCard = createEmptyCard();
    this.log = undefined;
  }
}

export class CardContent {
  front = '';
  back = '';

  constructor(init?: CardContent) {
    Object.assign(this, init);
  }
}
