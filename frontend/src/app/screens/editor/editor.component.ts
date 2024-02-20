import { Component, ComponentRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { concatMap, filter, finalize, map, take } from 'rxjs';
import { createEmptyCard } from 'ts-fsrs';
import { Deck, FlashCard, FlashCardContent } from '@models/database.model';
import { StorageService } from '@services/storage.service';
import { CardEditDialogComponent } from '@components/card-edit-dialog/card-edit-dialog.component';

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

  editDialogRef?: ComponentRef<CardEditDialogComponent>;
  idbKey = -1; // Id -1 means new Deck
  searchText: string;
  newDeckForm: FormGroup<NewCardForm>; 

  constructor(
    private route: ActivatedRoute,
    private viewContainerRef: ViewContainerRef,
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

  private _upsertFlashCard(content: FlashCardContent, index: number) {
    if (index === -1) {
      // Creates a new card. The methods 'createEmptyCard' generates all
      // the FSRS initial values.
      const newFlashCard = this._fb.nonNullable.control<FlashCard>({
        card: createEmptyCard(),
        content
      });

      this.flashCardsFormField.push(newFlashCard);
    } else {
      // Edits an already existent card
      const flashCardController = this.flashCardsFormField.at(index);
      const currentFlashCard = flashCardController.value;
      const newFlashCard = { ...currentFlashCard, content };

      flashCardController.patchValue(newFlashCard);
    }
  };

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

  handleOpenCardDialog(index: number) {
    let flashCard = index !== -1 ? this.flashCardsFormField.at(index) : undefined;

    this.editDialogRef = this.viewContainerRef.createComponent(CardEditDialogComponent);
    this.editDialogRef.instance.flashCardModel = new FlashCardContent(flashCard?.value.content);

    this.editDialogRef.instance.submit
      .pipe(
        take(1),
        filter(card => !!card),
        finalize(() => this.editDialogRef?.destroy()),
      )
      .subscribe((card) => this._upsertFlashCard(card, index));
  }

  handleDeleteCard(index: number) {
    this.flashCardsFormField.removeAt(index);
  };

  handleCreateDeck() {
    const deck = new Deck({ ...this.newDeckForm.value });

    // idbKey must be undefined on new cards
    if (this.idbKey !== -1) {
      deck.idbKey = this.idbKey;
    }

    this.storageService.setDeck(deck);
  };

  onSearchTextChange(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value;
  }
}
