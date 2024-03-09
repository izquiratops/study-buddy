import { Component, HostListener, Input } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { CardContent } from '@models/database.model';
import { CardForm } from '@models/editor.model';
import { EditorService } from '@screens/editor/editor.service';

@Component({
  selector: 'app-card-edit-dialog',
  templateUrl: './card-edit-dialog.component.html',
})
export class CardEditDialogComponent {
  @Input() cardModel: CardContent;
  @Input() index: number;

  @HostListener('keyup', ['$event'])
  onKeyUp(event: any) {
    if (event.ctrlKey && event.key == 'Enter') {
      // TODO: Add shortcut to submit
      alert('Ctrl+Enter key pressed');
    }
  }

  // 📒 Deck angular FormGroup
  cardForm: CardForm;

  constructor(
    private nnfb: NonNullableFormBuilder,
    private editorService: EditorService
  ) {}

  ngOnInit() {
    this.cardForm = this.nnfb.group({
      front: this.nnfb.control(this.cardModel.front, Validators.required),
      back: this.nnfb.control(this.cardModel.back, Validators.required),
    });
  }

  handleClearCardStats() {
    this.editorService.clearStatsCard(this.index);
  }

  handleDeleteCard() {
    this.editorService.deleteCard(this.index);
    this.editorService.editDialogRef?.destroy();
  }

  handleSubmit() {
    this.editorService.upsertCard(
      this.cardForm.value as CardContent,
      this.index
    );
    this.editorService.editDialogRef?.destroy();
  }

  handleDismiss() {
    this.editorService.editDialogRef?.destroy();
  }
}
