import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CardContent } from '@models/database.model';
import { EditorService } from '@screens/editor/editor.service';

@Component({
  selector: 'app-card-edit-dialog',
  templateUrl: './card-edit-dialog.component.html',
})
export class CardEditDialogComponent {
  @Input() cardModel: CardContent;
  @Input() index: number;
  @ViewChild('frontField', { static: true })
  frontFieldRef: ElementRef<HTMLInputElement>;

  constructor(private editorService: EditorService) {}

  ngAfterViewInit() {
    this.frontFieldRef.nativeElement.focus();
  }

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
