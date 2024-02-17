import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FlashCardContent } from '@models/database.model';

// Rename component to 'flash card edit dialog'
@Component({
  selector: 'app-card-edit-dialog',
  templateUrl: './card-edit-dialog.component.html',
})
export class CardEditDialogComponent {
  private _isOpen$ = new BehaviorSubject<boolean>(false);

  @Output() submit = new EventEmitter<FlashCardContent>();
  @ViewChild('flashCardForm') flashCardForm: NgForm;

  // This index keeps the position from the arrayForm on the deck. 
  // If the card is new is setted to -1.
  deckPositionForm: number = -1;
  flashCardModel: FlashCardContent = new FlashCardContent();

  constructor() {}

  get isOpen$() {
    return this._isOpen$.asObservable();
  }

  open() {
    this._isOpen$.next(true);
  }

  close() {
    this._isOpen$.next(false);
  }

  handleSubmit() {
    // Returns a copy of the form becuase the original data is wiped after the submit
    this.submit.emit({ ...this.flashCardModel });
    this.flashCardForm.resetForm();
    this.close();
  }

  handleDismiss() {
    this.close();
  }
}
