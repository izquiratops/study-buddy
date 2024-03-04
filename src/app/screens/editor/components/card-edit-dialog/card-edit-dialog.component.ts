import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CardContent } from '@models/database.model';
import { EditorService } from '@screens/editor/editor.service';

@Component({
  selector: 'app-card-edit-dialog',
  templateUrl: './card-edit-dialog.component.html',
})
export class CardEditDialogComponent {
  @Input() cardModel: CardContent;
  @Input() index: number;
  @ViewChild('cardForm') cardForm: NgForm;

  constructor(private editorService: EditorService) {}

  handleClearCardStats() {
    this.editorService.clearStatsCard(this.index);
  }

  handleDeleteCard() {
    this.editorService.deleteCard(this.index);
    this.editorService.editDialogRef?.destroy();
  }

  handleSubmit() {
    this.editorService.upsertCard(this.cardModel, this.index);
    this.editorService.editDialogRef?.destroy();
  }

  handleDismiss() {
    this.editorService.editDialogRef?.destroy();
  }
}
