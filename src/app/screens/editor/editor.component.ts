import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { concatMap, filter, map } from 'rxjs';
import { createEmptyCard } from 'ts-fsrs';
import { StorageService } from '@services/storage.service';
import { Deck, FlashCard, FlashCardContent } from '@models/database.model';
import { CardEditDialogComponent } from './components/card-edit-dialog/card-edit-dialog.component';

type NewCardForm = {
  name: FormControl<string>,
  flashCards: FormArray<FormControl<FlashCard>>
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
})
export class EditorComponent {
  private _fb = new FormBuilder();

  @ViewChild(CardEditDialogComponent) cardEditDialog!: CardEditDialogComponent;
  idbKey = -1; // Id -1 means new Deck
  searchText: string;
  newDeckForm: FormGroup<NewCardForm>; 

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
  ) {
    this.newDeckForm = this._fb.group<NewCardForm>({
      name: this._fb.nonNullable.control('', Validators.required),
      flashCards: this._fb.nonNullable.array<FlashCard>([], [control => this._requiredListValidator(control)])
    });
  }

  private _requiredListValidator(control: AbstractControl): any {
    return control.value.length > 0 ? null : { emptyList: true };
  }

  private _patchValueForm(deck: Deck) {
    this.nameFormField.patchValue(deck.name);

    // Append a new FormControl for each FlashCard
    for (const flashCard of deck.flashCards) {
      const control = this._fb.nonNullable.control(flashCard, Validators.required);
      this.flashCardsFormField.controls.push(control);
    }

    // Force validation, without this line the form initializes as invalid
    this.flashCardsFormField.updateValueAndValidity();
  }

  ngOnInit() {
    this.route.queryParams.pipe(
      filter(params => Object.hasOwn(params, 'id')),
      map(params => parseInt(params['id'])),
    ).subscribe(id => this.idbKey = id);
  
    this.storageService.onIdbReady$.pipe(
      filter(() => this.idbKey !== -1),
      concatMap(async () => await this.storageService.getDeck(this.idbKey))
    ).subscribe((deck) => {
      if (deck) {
        this._patchValueForm(deck);
      } else {
        throw new Error('Deck not found');
      }
    });
  }

  get nameFormField() {
    return this.newDeckForm.get('name') as FormControl<string>;
  }

  get flashCardsFormField() {
    return this.newDeckForm.get('flashCards') as FormArray<FormControl<FlashCard>>;
  }

  handleEditCard(index: number) {
    const flashCard = this.flashCardsFormField.at(index).value;
    this.cardEditDialog.deckPositionForm = index;
    this.cardEditDialog.flashCardModel = { ...flashCard.content };
    this.cardEditDialog.open();
  }

  handleDeleteCard(index: number) {
    this.flashCardsFormField.removeAt(index);
  };

  handleCreateDeck() {
    const deck = new Deck({ ...this.newDeckForm.value });

    if (this.idbKey !== -1) {
      deck.idbKey = this.idbKey;
    }

    this.storageService.setDeck(deck);
  };

  handleCreateNewCard() {
    this.cardEditDialog.deckPositionForm = -1;
    this.cardEditDialog.flashCardModel = new FlashCardContent();
    this.cardEditDialog.open();
  };

  onSearchTextChange(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value;
  }

  onSubmitNewCard(content: FlashCardContent) {
    const index = this.cardEditDialog.deckPositionForm;

    if (index >= 0) {
      // Edits an already existent card
      const flashCardController = this.flashCardsFormField.at(index);
      const currentFlashCard = flashCardController.value;
      const newFlashCard = { ...currentFlashCard, content };

      flashCardController.patchValue(newFlashCard);
    } else {
      // Creates a new card. The methods 'createEmptyCard' generates all
      // the FSRS initial values.
      const newFlashCard = this._fb.nonNullable.control<FlashCard>({
        card: createEmptyCard(),
        content
      });

      this.flashCardsFormField.push(newFlashCard);
    }
  };
}
