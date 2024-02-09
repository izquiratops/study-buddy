import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Card } from 'ts-fsrs';
import { Deck, Decks, ObjectStoreKey, objectStoreKeys } from '@models/database.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  isReady = new BehaviorSubject(false);
  private dbOpenRequest = indexedDB.open('flashcards', 12);
  private dataBase!: IDBDatabase;

  constructor() {
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
        objectStoreKey, { keyPath: objectStoreKey, autoIncrement: true }
      );
    }
  }

  private _retrieveObjectStore(name: ObjectStoreKey, mode: IDBTransactionMode = "readonly"): IDBObjectStore {
    const transaction = this.dataBase.transaction(name, mode)
    return transaction.objectStore(name);
  }

  setCard(card: Card) {
    const objectStore = this._retrieveObjectStore("cards", "readwrite");
    const request = objectStore.add(card);
    request.onsuccess = () => console.debug('Card added successfully');
    request.onerror = (ev: Event) => console.error("Failed to add a Card", ev);
  }

  setDeck(deck: Deck) {
    const objectStore = this._retrieveObjectStore("decks", "readwrite");
    const request = objectStore.add(deck);
    request.onsuccess = () => console.debug('Deck added successfully');
    request.onerror = (ev: Event) => console.error("Failed to add a Deck", ev);
  }

  async getDecksAsync(): Promise<Decks> {
    return new Promise((resolve, reject) => {
      const objectStore = this._retrieveObjectStore("decks");
      const request = objectStore.getAll();

      request.onsuccess = (ev: Event) => {
        console.debug("Decks fetched from IDB object store", ev);
        resolve((ev.target as IDBRequest).result as Decks);
      };

      request.onerror = (ev: Event) => {
        console.error("Failed to add a Deck", ev);
        reject();
      }
    })
  }
}
