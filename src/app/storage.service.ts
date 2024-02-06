import { Injectable } from '@angular/core';
import { Card } from 'ts-fsrs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private dbOpenRequest = indexedDB.open('flashcards', 4);
  private dataBase!: IDBDatabase;
  private cardsObjectStore!: IDBObjectStore;

  constructor() {
    this.dbOpenRequest.onerror = console.error;
    this.dbOpenRequest.onsuccess = (ev: Event) => {
      this.dataBase = (ev.target as IDBOpenDBRequest).result;
      this.dataBase.onerror = console.error;

      const objectStore = this.dataBase.createObjectStore("cards", { keyPath: 'cards' });
      objectStore.createIndex("name", "name", { unique: true });
      // objectStore.transaction.oncomplete = (_: Event) => {
      //   // this.dataBase.transaction("cards", "readwrite").objectStore("cards");
      // }
    }
  }

  saveCard(card: Card) {
    this.cardsObjectStore.add(card);
  }
}
