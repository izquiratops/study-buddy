import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { CardEditDialogComponent } from './components/card-edit-dialog/card-edit-dialog.component';
import { Deck, FlashCard, FlashCardContent } from '@models/database.model';
import { DeckForm } from '@models/editor.model';

import { createEmptyCard } from 'ts-fsrs';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  private editDialogRef?: ComponentRef<CardEditDialogComponent>;

  deckForm: DeckForm;
  viewContainerRef: ViewContainerRef;

  constructor(
    private nnfb: NonNullableFormBuilder,
  ) {
    this.deckForm = this.nnfb.group({
      idbKey: this.nnfb.control<number>(
        -1
      ),
      name: this.nnfb.control<string>(
        '', Validators.required
      ),
      flashCards: this.nnfb.array<FlashCard>(
        [],
        [ctr => this._requiredListValidator(ctr)]
      )
    });
  }

  private _requiredListValidator(control: AbstractControl): any {
    return control.value.length > 0 ? null : { emptyList: true };
  }

  upsertCard(content: FlashCardContent, index?: number) {
    if (index) {
      // Edits an already existent card
      const cardFormControl = this.deckForm.controls.flashCards.at(index);
      const currentState = cardFormControl.value;
      const newState = { ...currentState, content };

      cardFormControl.patchValue(newState);
    } else {
      // TODO: Card constructor with createEmptyCard on it?
      const newCard = this.nnfb.control<FlashCard>({
        card: createEmptyCard(), content
      });

      this.deckForm.controls.flashCards.push(newCard);
    }
  };

  populateForm(deck: Deck) {
    this.deckForm.get('name')?.patchValue(deck.name);
    this.deckForm.get('idbKey')?.patchValue(deck.idbKey);

    // Append a new FormControl for each FlashCard
    for (const flashCard of deck.flashCards) {
      const control = this.nnfb.control(flashCard, Validators.required);
      this.deckForm.controls.flashCards.push(control);
    }

    // Force validation, without this line the form initializes as invalid
    this.deckForm.updateValueAndValidity();
  }

  openCardDialog(index?: number) {
    const cards = this.deckForm.get('flashCards');

    // TODO: Set id on Cards, I'm currently using list position
    const card = index ? cards?.value.at(index) : undefined;

    this.editDialogRef = this.viewContainerRef.createComponent(CardEditDialogComponent);
    this.editDialogRef.instance.flashCardModel = new FlashCardContent(card?.content);
    this.editDialogRef.instance.index = index;
  }

  dismissCardDialog() {
    this.editDialogRef?.destroy();
  }

  deleteCard(index: number) {
    this.deckForm.controls.flashCards.removeAt(index);
  };
}
