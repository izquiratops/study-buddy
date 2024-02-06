import { Injectable } from '@angular/core';
import { Card, createEmptyCard } from 'ts-fsrs';

enum ObjectStoreKey {
  Card = "cards",
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private dbOpenRequest = indexedDB.open('flashcards', 6);
  private dataBase!: IDBDatabase;

  constructor() {
    this.dbOpenRequest.onerror = console.error;
    this.dbOpenRequest.onsuccess = this._onDBRequestSuccess.bind(this);
    this.dbOpenRequest.onupgradeneeded = this._onDBUpgradeNeeded.bind(this);
  }

  private _onDBRequestSuccess(ev: Event) {
    this.dataBase = (ev.target as IDBOpenDBRequest).result;
    this.dataBase.onerror = console.error;
  }

  private _onDBUpgradeNeeded(ev: Event) {
    const dataBase = (ev.target as IDBOpenDBRequest).result;

    for (const objectStoreKey of Object.values(ObjectStoreKey)) {
      dataBase.createObjectStore(
        objectStoreKey, { keyPath: objectStoreKey, autoIncrement: true }
      );
    }
  }

  private _retrieveObjectStore(name: ObjectStoreKey): IDBObjectStore {
    const transaction = this.dataBase.transaction(name, "readwrite")
    return transaction.objectStore("cards");
  }

  saveCard(card: Card) {
    const objectStore = this._retrieveObjectStore(ObjectStoreKey.Card);
    const request = objectStore.add(card);
    request.onsuccess = () => console.debug('Card added successfully');
    request.onerror = () => console.error("Failed to add a Card");
  }
}
