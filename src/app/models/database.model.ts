import { Card as FsrsCard, ReviewLog, createEmptyCard } from "ts-fsrs";

// Database
export const objectStoreKeys = ["decks"] as const;
export type ObjectStoreKey = typeof objectStoreKeys[number]

// Decks
export class Deck {
    idbKey: number;
    name: string;
    cards: Cards;

    public constructor(init?: Partial<Deck>) {
        Object.assign(this, init);
    }
}
export type NewDeck = Omit<Deck, 'idbKey'> & { idbKey?: number };
export interface ProcessedDeck extends Deck {
    toBeReviewedCount: number,
};
export type Decks = Array<Deck>;
export type ProcessedDecks = Array<ProcessedDeck>;

export enum Rating {
    
}

// Cards
export type Cards = Array<Card>;
export class Card {
    fsrsCard: FsrsCard;
    content: CardContent;
    log?: ReviewLog; // Logs are empty on fresh new cards

    public constructor(init?: Partial<Card>) {
        Object.assign(this, init);
        this.fsrsCard = createEmptyCard();
    }
};
export class CardContent {
    front = '';
    back = '';

    public constructor(init?: CardContent) {
        Object.assign(this, init);
    }
}
