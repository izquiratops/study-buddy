import { Component } from '@angular/core';
import { EditorService } from '@screens/editor/editor.service';

@Component({
  selector: 'app-cards-table',
  templateUrl: './cards-table.component.html',
  styleUrl: './cards-table.component.css'
})
export class CardsTableComponent {
  constructor(private editorService: EditorService) {}

  get cards() {
    return this.editorService.deckForm.get('cards')!.value;
  }

  get searchText() {
    return this.editorService.searchText;
  }

  handleOpenCardDialog(index: number) {
    this.editorService.openCardDialog(index);
  }
}
