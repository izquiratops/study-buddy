import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormArray, NonNullableFormBuilder, Validators } from '@angular/forms';
import { CardEditDialogComponent } from './components/card-edit-dialog/card-edit-dialog.component';
import { Deck, Card, CardContent } from '@models/database.model';
import { DeckForm } from '@models/editor.model';

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
      idbKey: this.nnfb.control(-1),
      name: this.nnfb.control('', Validators.required),
      cards: this.nnfb.array<Card>([], this._requiredListValidator)
    });
  }

  private _requiredListValidator(control: AbstractControl): any {
    return control.value.length > 0 ? null : { emptyList: true };
  }

  upsertCard(content: CardContent, index: number) {
    if (index !== -1) {
      // Edits an already existent card
      const cardFormControl = this.deckForm.controls.cards.at(index);
      const currentState = cardFormControl.value;
      const newState = { ...currentState, content };

      cardFormControl.patchValue(newState);
    } else {
      const newCard = new Card({ content });
      const newCardControl = this.nnfb.control(newCard);

      this.deckForm.controls.cards.push(newCardControl);
    }
  };

  deleteCard(index: number) {
    this.deckForm.controls.cards.removeAt(index);
  };

  populateForm(deck: Deck) {
    this.deckForm.get('name')?.setValue(deck.name);
    this.deckForm.get('idbKey')?.setValue(deck.idbKey);

    const control = this.deckForm.get('cards') as FormArray;
    for (const card of deck.cards) {
      control.push(this.nnfb.control(card));
    }
  }

  clearForm() {
    this.deckForm.reset();
    this.deckForm.controls.cards.clear();
  }

  openCardDialog(index: number) {
    const cards = this.deckForm.get('cards');

    // TODO: Set id on Cards, I'm currently using list position
    const card = index !== -1 ? cards?.value.at(index) : undefined;

    this.editDialogRef = this.viewContainerRef.createComponent(CardEditDialogComponent);
    this.editDialogRef.instance.cardModel = new CardContent(card?.content);
    this.editDialogRef.instance.index = index;
  }

  dismissCardDialog() {
    this.editDialogRef?.destroy();
  }
}
