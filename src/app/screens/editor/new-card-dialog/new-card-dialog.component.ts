import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FlashCardContent } from '@models/database.model';

@Component({
  selector: 'app-new-card-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-card-dialog.component.html',
  styleUrl: './new-card-dialog.component.css'
})
export class NewCardDialogComponent {
  @Input('showDialog') showDialog$!: BehaviorSubject<boolean>;
  @Output() submitNewCard = new EventEmitter<FlashCardContent>();

  newCardModel: FlashCardContent = { front: '', back: '' };

  handleSubmit() {
    this.submitNewCard.emit({...this.newCardModel});
  }

  handleDismiss() {
    this.showDialog$.next(false);
  }
}
