import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlashCardContent } from '@models/database.model';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {
  newCardModel: FlashCardContent  = { front: '', back: '' };

  onSubmit(ev: Event) {
    console.debug('Form is submitting...', ev);
  };
}
