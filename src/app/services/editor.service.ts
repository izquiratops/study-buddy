import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, filter, firstValueFrom, map, switchMap } from 'rxjs';
import { CardEditDialogComponent } from '../screens/editor/components/card-edit-dialog/card-edit-dialog.component';
import { FileService, StorageService } from '@services';
import { Deck, Card, CardContent, DeckForm, NewDeck } from '@models';

@Injectable({
  providedIn: 'root',
})
export class EditorService {
  // 📒 Reference to the Card dialog component
  editDialogRef?: ComponentRef<CardEditDialogComponent>;
  // 📍 Editor Screen View reference
  editorScreenViewRef: ViewContainerRef;

  // 🔎 Current search input value
  searchText: string = '';
  // 📒 Deck angular FormGroup
  deckForm: DeckForm;

  constructor(
    private nnfb: NonNullableFormBuilder,
    private route: ActivatedRoute,
    private fileService: FileService,
    private storageService: StorageService
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

  private _getCardControl(index: number) {
    if (index === -1) {
      return null;
    }

    const cards = this.deckForm.get('cards')! as FormArray;
    return cards.at(index) as FormControl<Card>;
  }

  initializeEditor() {
    return firstValueFrom(
      combineLatest([
        this.route.queryParams,
        this.storageService.onIdbReady$,
      ]).pipe(
        filter(([params, isReady]) => Object.hasOwn(params, 'id') && isReady),
        map(([params, _]) => Number.parseInt(params['id'])),
        switchMap((id) => this.storageService.getDeck(id))
      )
    );
  }

  applyDeckToIdb() {
    const formValue = this.deckForm.value;

    if (formValue.idbKey === -1) {
      delete formValue.idbKey;
    }

    this.storageService.setDeck(formValue as NewDeck);
  }

  upsertCard(content: CardContent, index: number) {
    if (index !== -1) {
      // Edits an already existent card
      const cardControl = this._getCardControl(index)!;
      const newCardValue = new Card({ ...cardControl.value, content });

      cardControl.patchValue(newCardValue);
    } else {
      // Push a new card object into the list
      const newCard = new Card({ content });
      const newCardControl = this.nnfb.control(newCard);
      this.deckForm.controls.cards.push(newCardControl);
    }
  }

  deleteCard(index: number) {
    const control = this.deckForm.get('cards') as FormArray;
    control.removeAt(index);
  }

  clearStatsCard(index: number) {
    const cardControl = this._getCardControl(index);
    cardControl?.value.clearStats();
  }

  importIdbDeck(deck: Deck) {
    const control = this.deckForm.get('cards') as FormArray;

    this.deckForm.get('name')!.setValue(deck.name);
    this.deckForm.get('idbKey')!.setValue(deck.idbKey);

    for (const card of deck.cards) {
      control.push(this.nnfb.control(card));
    }
  }

  async importCsvFile(file: File) {
    const control = this.deckForm.get('cards') as FormArray;
    const parsedFile: any = await this.fileService.parseCsv(file);

    const name = file.name.endsWith('.csv')
      ? file.name.slice(0, -4)
      : file.name;
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

  openCardDialog(index: number) {
    const cardControl = this._getCardControl(index);
    this.editDialogRef = this.editorScreenViewRef.createComponent(
      CardEditDialogComponent
    );
    this.editDialogRef.instance.cardModel = new CardContent(
      cardControl?.value.content
    );
    this.editDialogRef.instance.index = index;
  }
}
