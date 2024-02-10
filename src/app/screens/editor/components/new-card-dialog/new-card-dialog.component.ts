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
  @Input('isOpen') isOpen$!: BehaviorSubject<boolean>;
  @Output() submitNewCard = new EventEmitter<FlashCardContent>();

  newCardModel: FlashCardContent = { front: '', back: '' };

  handleSubmit() {
    // Returns a copy of the form becuase the original data is wiped after the submit
    this.submitNewCard.emit({...this.newCardModel});
    this.isOpen$.next(false);
  }

  handleDismiss() {
    this.isOpen$.next(false);
  }
}
