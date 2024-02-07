export const objectStoreKeys = ["cards", "decks"] as const;
export type ObjectStoreKey = typeof objectStoreKeys[number];

export type Decks = Array<Deck>;
export type Deck = {
    front: string,
    back: string,
    difficulty: string,
}
