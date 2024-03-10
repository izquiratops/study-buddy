import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Deck, Decks, NewDeck, ObjectStoreKey, ObjectStoreKeys } from '@models';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private dbOpenRequest = indexedDB.open('cards', 14);
  private dataBase: IDBDatabase;

  readonly onIdbReady$ = new BehaviorSubject(false);

  constructor() {
    console.debug('Initializing Storage Service...');
    this.dbOpenRequest.onerror = console.error;
    this.dbOpenRequest.onsuccess = this._onDBRequestSuccess.bind(this);
    this.dbOpenRequest.onupgradeneeded = this._onDBUpgradeNeeded.bind(this);
  }

  private _onDBRequestSuccess(ev: Event) {
    this.dataBase = (ev.target as IDBOpenDBRequest).result;
    this.dataBase.onerror = console.error;

    // Letting know to listeners that indexedDB is ready
    this.onIdbReady$.next(true);
  }

  private _onDBUpgradeNeeded(ev: Event) {
    const dataBase = (ev.target as IDBOpenDBRequest).result;

    for (const objectStoreKey of ObjectStoreKeys) {
      if (dataBase.objectStoreNames.contains(objectStoreKey)) {
        continue;
      }

      dataBase.createObjectStore(objectStoreKey, {
        keyPath: 'idbKey',
        autoIncrement: true,
      });
    }
  }

  private _retrieveObjectStore(
    name: ObjectStoreKey,
    mode: IDBTransactionMode = 'readonly'
  ): IDBObjectStore {
    const transaction = this.dataBase.transaction(name, mode);
    return transaction.objectStore(name);
  }

  async setDeck(deck: NewDeck): Promise<void> {
    return new Promise((resolve, reject) => {
      // Having already an idbKey will override the deck data, otherwise adds a fresh new card
      const objectStore = this._retrieveObjectStore('decks', 'readwrite');
      const request = objectStore.put(deck);

      request.onsuccess = () => {
        console.debug('Deck added successfully');
        resolve();
      };

      request.onerror = (ev: Event) => {
        console.error('Failed to add a Deck', ev);
        reject();
      };
    });
  }

  async getDeck(index: number): Promise<Deck> {
    return new Promise((resolve, reject) => {
      const objectStore = this._retrieveObjectStore('decks', 'readonly');
      const request = objectStore.openCursor(index);

      request.onsuccess = (ev: Event) => {
        const cursor: IDBCursorWithValue = (ev.target as IDBRequest)?.result;
        const deck: Deck = cursor?.value;
        console.debug('Deck fetched from IDB object store', deck);
        resolve(new Deck(deck));
      };

      request.onerror = (ev: Event) => {
        console.error('Failed to find a Deck', ev);
        reject();
      };
    });
  }

  async deleteDeck(index: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const objectStore = this._retrieveObjectStore('decks', 'readwrite');
      const request = objectStore.delete(index);

      request.onsuccess = () => {
        console.debug('Deck deleted successfully');
        resolve();
      };

      request.onerror = (ev: Event) => {
        console.error('Failed to delete a Deck', ev);
        reject();
      };
    });
  }

  async getDecks(): Promise<Decks> {
    return new Promise((resolve, reject) => {
      const objectStore = this._retrieveObjectStore('decks', 'readonly');
      const request = objectStore.getAll();

      request.onsuccess = (ev: Event) => {
        const decks = (ev.target as IDBRequest)?.result as Decks;
        console.debug('Decks fetched from IDB object store', decks);
        resolve(decks.map((curr) => new Deck(curr)));
      };

      request.onerror = (ev: Event) => {
        console.error('Failed to add a Deck', ev);
        reject();
      };
    });
  }
}
