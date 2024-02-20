import { Card, ReviewLog } from "ts-fsrs";

export const objectStoreKeys = ["cards", "decks"] as const;
export type ObjectStoreKey = typeof objectStoreKeys[number]

// TODO: Rename
export type ProcessedDecks = Array<ProcessedDeck>;
export interface ProcessedDeck extends Deck {
    toBeReviewedCount: number,
};
export type Decks = Array<Deck>;
export class Deck {
    idbKey: number;
    name: string;
    flashCards: FlashCards;

    public constructor(init?: Partial<Deck>) {
        Object.assign(this, init);
    }
}

export type FlashCards = Array<FlashCard>;
export type FlashCard = {
    card: Card,
    content: FlashCardContent,
    log?: ReviewLog, // Logs are empty on fresh new cards
};
export class FlashCardContent {
    front = '';
    back = '';

    public constructor(init?: FlashCardContent) {
        Object.assign(this, init);
    }
}
