import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { CardEditDialogComponent } from './components/card-edit-dialog/card-edit-dialog.component';
import { Deck, Card, CardContent } from '@models/database.model';
import { DeckForm } from '@models/editor.model';
import { FileService } from '@services/file.service';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditorService {
  // 📒 Reference to the Card dialog component
  private editDialogRef?: ComponentRef<CardEditDialogComponent>;
  // ❓ Reference to the Confirm dialog component
  private confirmDialogRef?: ComponentRef<ConfirmDialogComponent>;
  // 🔎 Current search input value
  searchText: string;
  // 📍 Component View reference
  viewContainerRef: ViewContainerRef;
  // 📒 Deck angular FormGroup
  deckForm: DeckForm;

  constructor(
    private nnfb: NonNullableFormBuilder,
    private fileService: FileService
  ) {
    this.deckForm = this.nnfb.group({
      idbKey: this.nnfb.control(-1),
      name: this.nnfb.control('', Validators.required),
      cards: this.nnfb.array<Card>([], this._requiredListValidator),
    });
  }

  private _requiredListValidator(control: AbstractControl): any {
    return control.value.length > 0 ? null : { emptyList: true };
  }

  /**
   * Can be called as:
   * - this.getCardControl<FormControl<Card>> to get their FormControl
   * - this.getCardControl<Card> to get just their value
   * @param index Card position in the ArrayForm
   * @returns
   */
  private getCardControl<T>(index: number): T | undefined {
    if (index === -1) {
      return;
    }

    const cards = this.deckForm.get('cards')! as FormArray;
    return cards.at(index) as T;
  }

  upsertCard(content: CardContent, index: number) {
    if (index !== -1) {
      // Edits an already existent card
      const cardControl = this.getCardControl<FormControl<Card>>(index)!;
      const newCardValue = new Card({ ...cardControl.value, content });

      cardControl.patchValue(newCardValue);
    } else {
      const newCard = new Card({ content });
      const newCardControl = this.nnfb.control(newCard);
      this.deckForm.controls.cards.push(newCardControl);
    }
  }

  clearCardState(index: number) {
    const cardControl = this.getCardControl<FormControl<Card>>(index);
    cardControl?.value.clearStats();
  }

  deleteCard(index: number) {
    const control = this.deckForm.get('cards') as FormArray;
    control.removeAt(index);
  }

  importDeck(deck: Deck) {
    const control = this.deckForm.get('cards') as FormArray;

    this.deckForm.get('name')!.setValue(deck.name);
    this.deckForm.get('idbKey')!.setValue(deck.idbKey);

    for (const card of deck.cards) {
      control.push(this.nnfb.control(card));
    }
  }

  async importCsvFile(inputTarget: File) {
    const control = this.deckForm.get('cards') as FormArray;
    const parsedFile: any = await this.fileService.parseCsv(inputTarget);

    const name = inputTarget.name.endsWith('.csv')
      ? inputTarget.name.slice(0, -4)
      : inputTarget.name;
    this.deckForm.get('name')!.setValue(name);

    for (const entry of parsedFile.data) {
      const card = new Card({
        content: { front: entry.at(0), back: entry.at(1) },
      });

      control.push(this.nnfb.control(card));
    }
  }

  exportCsvFile() {
    const control = this.deckForm.get('cards') as FormArray<FormControl<Card>>;
    const deck = control.value.map((card) => card.content);
    this.fileService.unparseCsv(deck);
  }

  clearForm() {
    this.deckForm.reset();
    this.deckForm.controls.cards.clear();
  }

  openCardDialog(index: number) {
    const cardControl = this.getCardControl<FormControl<Card>>(index);
    this.editDialogRef = this.viewContainerRef.createComponent(
      CardEditDialogComponent
    );
    this.editDialogRef.instance.cardModel = new CardContent(
      cardControl?.value.content
    );
    this.editDialogRef.instance.index = index;
  }

  dismissCardDialog() {
    this.editDialogRef?.destroy();
  }
}
