import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Deck, Decks, ObjectStoreKey, objectStoreKeys } from '@models/database.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  isReady = new BehaviorSubject(false);
  private dbOpenRequest = indexedDB.open('flashcards', 14);
  private dataBase: IDBDatabase;

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
    this.isReady.next(true);
  }

  private _onDBUpgradeNeeded(ev: Event) {
    const dataBase = (ev.target as IDBOpenDBRequest).result;

    for (const objectStoreKey of objectStoreKeys) {
      if (dataBase.objectStoreNames.contains(objectStoreKey)) {
        continue;
      }

      dataBase.createObjectStore(
        objectStoreKey, { keyPath: "idbKey", autoIncrement: true }
      );
    }
  }

  private _retrieveObjectStore(name: ObjectStoreKey, mode: IDBTransactionMode = "readonly"): IDBObjectStore {
    const transaction = this.dataBase.transaction(name, mode)
    return transaction.objectStore(name);
  }

  async setDeck(deck: Deck): Promise<void> {
    return new Promise((resolve, reject) => {
      const objectStore = this._retrieveObjectStore("decks", "readwrite");
      const request = objectStore.add(deck);

      request.onsuccess = () => {
        console.debug('Deck added successfully');
        resolve();
      };

      request.onerror = (ev: Event) => {
        console.error("Failed to add a Deck", ev);
        reject();
      };
    });
  }

  async getDeck(index: number): Promise<Deck> {
    return new Promise((resolve, reject) => {
      const objectStore = this._retrieveObjectStore("decks", "readonly");
      const request = objectStore.openCursor(index);

      request.onsuccess = (ev: Event) => {
        const cursor: IDBCursorWithValue = ((ev.target) as IDBRequest).result;
        resolve(cursor.value);
      };

      request.onerror = (ev: Event) => {
        console.error("Failed to find a Deck", ev);
        reject();
      };
    });
  }

  async deleteDeck(index: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const objectStore = this._retrieveObjectStore("decks", "readwrite");
      const request = objectStore.delete(index);

      request.onsuccess = () => {
        console.debug('Deck deleted successfully');
        resolve();
      };

      request.onerror = (ev: Event) => {
        console.error("Failed to delete a Deck", ev);
        reject();
      };
    })
  }

  async getDecks(): Promise<Decks> {
    return new Promise((resolve, reject) => {
      const objectStore = this._retrieveObjectStore("decks", "readonly");
      const request = objectStore.getAll();

      request.onsuccess = (ev: Event) => {
        console.debug("Decks fetched from IDB object store", ev);
        resolve((ev.target as IDBRequest).result as Decks);
      };

      request.onerror = (ev: Event) => {
        console.error("Failed to add a Deck", ev);
        reject();
      };
    })
  }
}
