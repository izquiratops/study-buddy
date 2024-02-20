import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FlashCardContent } from '@models/database.model';

@Component({
  selector: 'app-card-edit-dialog',
  templateUrl: './card-edit-dialog.component.html',
})
export class CardEditDialogComponent {
  @Input() flashCardModel: FlashCardContent;
  @Output() submit = new EventEmitter<FlashCardContent>();
  @Output() dismiss = new EventEmitter<void>();
  @ViewChild('flashCardForm') flashCardForm: NgForm;

  constructor() {}

  handleSubmit() {
    this.submit.emit(this.flashCardModel);
  }

  handleDismiss() {
    this.submit.emit();
  }
}
