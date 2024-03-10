export const ObjectStoreKeys = ['decks'] as const;

export type ObjectStoreKey = (typeof ObjectStoreKeys)[number];
