import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { filter, map } from 'rxjs';
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
  styleUrl: './editor.component.css'
})
export class EditorComponent {
  @ViewChild(CardEditDialogComponent) cardEditDialog!: CardEditDialogComponent;

  private _fb = new FormBuilder();

  newDeckForm = this._fb.group<NewCardForm>({
    name: this._fb.nonNullable.control('', Validators.required),
    flashCards: this._fb.nonNullable.array<FlashCard>([], Validators.required)
  });

  constructor(
    private route: ActivatedRoute,
    private editorService: EditorService,
    private storageService: StorageService,
    ) {}

  ngOnInit() {
    this.route.queryParams.pipe(
      map(p => p['id']),
      filter(id => id)
    ).subscribe((id) => this._loadDeck(id));
  }

  private async _loadDeck(index: number) {
    const deck = await this.storageService.getDeck(index);
    console.debug('hurray!');
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
    // Forcing the value to be a Deck because I don't know how types works on reactive forms
    const deck = new Deck(this.newDeckForm.value);
    this.storageService.setDeck(deck);
  };

  handleCreateNewCard() {
    this.cardEditDialog.deckPositionForm = -1;
    this.cardEditDialog.flashCardModel = new FlashCardContent();
    this.cardEditDialog.open();
  };

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
