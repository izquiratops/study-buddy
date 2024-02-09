import { Card, ReviewLog } from "ts-fsrs";

export const objectStoreKeys = ["cards", "decks"] as const;
export type ObjectStoreKey = typeof objectStoreKeys[number];

export type Decks = Array<Deck>;
export type Deck = {
    name: string,
    flashCards: FlashCards
}

export type FlashCards = Array<FlashCard>;
export type FlashCard = {
    card: Card,
    content: FlashCardContent,
    log?: ReviewLog, // Logs are empty on fresh new cards
}

export type FlashCardContent = {
    front: string,
    back: string
}