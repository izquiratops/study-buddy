import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { createEmptyCard } from 'ts-fsrs';
import { FlashCard, FlashCardContent, FlashCards } from '@models/database.model';
import { StorageService } from '@services/storage.service';
import { NewCardDialogComponent } from './new-card-dialog/new-card-dialog.component';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NewCardDialogComponent],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {
  showNewCardDialog$ = new BehaviorSubject(false);
  flashCards$ = new BehaviorSubject<FlashCards>([]);

  constructor(public storageService: StorageService) {
  }

  handleShowNewCardDialog() {
    this.showNewCardDialog$.next(true);
  };

  handleDeleteCard(index: number) {
    const currentFlashCards = this.flashCards$.getValue();
    const newFlashCards = currentFlashCards.filter((_, position) => position !== index);

    this.flashCards$.next(newFlashCards);
  };

  handleCreateDeck() {
    this.storageService.setDeck({
      name: 'lore ipsum',
      flashCards: this.flashCards$.getValue()
    });
  };

  onSubmitNewCard(content: FlashCardContent) {
    const currentFlashCards = this.flashCards$.getValue();
    const newFlashCard: FlashCard = {
      card: createEmptyCard(),
      content,
    };

    this.flashCards$.next([...currentFlashCards, newFlashCard]);
    this.showNewCardDialog$.next(false);
  };
}
