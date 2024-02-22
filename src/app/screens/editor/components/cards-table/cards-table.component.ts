import { Component } from '@angular/core';
import { EditorService } from '@screens/editor/editor.service';

@Component({
  selector: 'app-cards-table',
  templateUrl: './cards-table.component.html',
})
export class CardsTableComponent {
  searchText: string;

  constructor(private editorService: EditorService) {}

  get cards() {
    return this.editorService.deckForm.get('flashCards')!.value;
  }

  onSearchTextChange(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value;
  }

  handleOpenCardDialog(index?: number) {
    this.editorService.openCardDialog(index);
  }

  handleDeleteCard(index: number) {
    this.editorService.deleteCard(index);
  };
}
