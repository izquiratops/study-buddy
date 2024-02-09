import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { createEmptyCard } from 'ts-fsrs';
import { StorageService } from '@services/storage.service';
import { Deck, FlashCard, FlashCardContent } from '@models/database.model';
import { NewCardDialogComponent } from './new-card-dialog/new-card-dialog.component';

type NewCardForm = {
  name: FormControl<string>,
  flashCards: FormArray<FormControl<FlashCard>>
}

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NewCardDialogComponent],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {
  private _fb = new FormBuilder();
  newDeckForm = this._fb.group<NewCardForm>({
    name: this._fb.nonNullable.control('', Validators.required),
    flashCards: this._fb.nonNullable.array<FlashCard>([], Validators.required)
  });

  newCardDialogOpen$ = new BehaviorSubject(false);

  get flashCardsFormField() {
    return this.newDeckForm.get('flashCards') as FormArray<FormControl<FlashCard>>;
  }

  constructor(public storageService: StorageService) {
  }

  handleDeleteCard(index: number) {
    this.flashCardsFormField.removeAt(index);
  };

  handleCreateDeck() {
    // Forcing the value to be a Deck because I don't know how types works on reactive forms
    this.storageService.setDeck(this.newDeckForm.value as Deck);
  };

  handleOpenNewCardDialog() {
    this.newCardDialogOpen$.next(true);
  };

  onSubmitNewCard(content: FlashCardContent) {
    const newFlashCard = this._fb.nonNullable.control<FlashCard>({
      card: createEmptyCard(),
      content
    });

    this.flashCardsFormField.push(newFlashCard);
  };
}
