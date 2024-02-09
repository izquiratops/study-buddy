import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { createEmptyCard } from 'ts-fsrs';
import { StorageService } from '@services/storage.service';
import { Deck, FlashCard, FlashCardContent } from '@models/database.model';
import { NewCardDialogComponent } from './new-card-dialog/new-card-dialog.component';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NewCardDialogComponent],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {
  showNewCardDialog$ = new BehaviorSubject(false);
  
  newDeckForm = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    flashCards: new FormArray<FormControl<FlashCard>>([], Validators.required)
  });

  get flashCards() {
    return this.newDeckForm.get('flashCards') as FormArray<FormControl<FlashCard>>;
  }

  constructor(public storageService: StorageService) {
  }

  handleShowNewCardDialog() {
    this.showNewCardDialog$.next(true);
  };

  handleDeleteCard(index: number) {
    this.flashCards.removeAt(index);
  };

  handleCreateDeck() {
    // Forcing the value to be a Deck because I don't know how types works on reactive forms
    this.storageService.setDeck(this.newDeckForm.value as Deck);
  };

  onSubmitNewCard(content: FlashCardContent) {
    const newFlashCard = new FormControl<FlashCard>({
      card: createEmptyCard(),
      content
    }, { nonNullable: true });

    this.flashCards.push(newFlashCard);
    this.showNewCardDialog$.next(false);
  };
}
