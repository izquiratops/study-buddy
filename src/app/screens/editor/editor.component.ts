import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { createEmptyCard } from 'ts-fsrs';
import { StorageService } from '@services/storage.service';
import { EditorService } from './editor.service';
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
  idbKey?: number;
  searchText: string;
  newDeckForm: FormGroup<NewCardForm>;

  constructor(
    private route: ActivatedRoute,
    private editorService: EditorService,
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

  ngOnInit() {
    this.route.queryParams.pipe(
      map(params => {
        const id = params['id'];

        if (id) {
          return Number.parseInt(id);
        } else {
          return undefined;
        }
      }),
    ).subscribe(id => this.idbKey = id);

    this.storageService.onIdbReady.subscribe(async () => {
      if (!this.idbKey) {
        return;
      }

      const deck = await this.storageService.getDeck(this.idbKey);

      if (deck) {
        this.nameFormField.patchValue(deck.name);

        for (const flashCard of deck.flashCards) {
          // Append a new FormControl for each FlashCard
          const control = this._fb.nonNullable.control(flashCard, Validators.required);
          this.flashCardsFormField.controls.push(control);
        }

        this.flashCardsFormField.updateValueAndValidity();
      } else {
        // TODO: Use a dialog for this. Add a navigation back to Home
        alert('It seems like I can\'t find the deck.')
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
    const deck = new Deck({
      idbKey: this.idbKey, ...this.newDeckForm.value
    });

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
