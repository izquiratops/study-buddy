import { Injectable } from '@angular/core';
import { Card } from 'ts-fsrs';
import { ObjectStoreKey, objectStoreKeys } from './database.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private dbOpenRequest = indexedDB.open('flashcards', 10);
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
    return transaction.objectStore("cards");
  }

  saveCard(card: Card) {
    const objectStore = this._retrieveObjectStore("cards", "readwrite");
    const request = objectStore.add(card);
    request.onsuccess = () => console.debug('Card added successfully');
    request.onerror = () => console.error("Failed to add a Card");
  }
}
