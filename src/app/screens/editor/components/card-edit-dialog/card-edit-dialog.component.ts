import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FlashCardContent } from '@models/database.model';
import { EditorService } from '@screens/editor/editor.service';

@Component({
  selector: 'app-card-edit-dialog',
  templateUrl: './card-edit-dialog.component.html',
})
export class CardEditDialogComponent {
  @Input() flashCardModel: FlashCardContent;
  @Input() index?: number;
  @ViewChild('flashCardForm') flashCardForm: NgForm;

  constructor(private editorService: EditorService) {}

  handleSubmit() {
    this.editorService.upsertCard(this.flashCardModel, this.index);
    this.editorService.dismissCardDialog();
  }

  handleDismiss() {
    this.editorService.dismissCardDialog();
  }
}
