import { ChangeDetectorRef, Component, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EditorService } from '@services';
import { NavigatorAction } from '@models';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
})
export class EditorComponent {
  loadingDeck$ = new BehaviorSubject(true);
  navigatorActions: Array<NavigatorAction> = [
    {
      type: 'Method',
      label: 'Export to CSV 💾',
      callback: () => this.handleExportCsv(),
    },
    {
      type: 'Method',
      label: 'Add Card ✍🏼',
      callback: () => this.handleOpenDialog(-1),
    },
  ];

  constructor(
    private viewContainerRef: ViewContainerRef,
    private changeDetectionRef: ChangeDetectorRef,
    public editorService: EditorService
  ) {
    this.editorService.editorScreenViewRef = viewContainerRef;
  }

  get deckForm() {
    return this.editorService.deckForm;
  }

  get submitButtonLabel() {
    return this.deckForm.get('idbKey')!.value === -1
      ? 'Create Deck 🔨'
      : 'Apply Changes ✅';
  }

  get hasItems() {
    return this.deckForm.get('cards')!.value.length > 0;
  }

  ngOnInit() {
    this.editorService
      .initializeEditor()
      .then((deck) => {
        this.editorService.importIdbDeck(deck);
      })
      .finally(() => {
        this.loadingDeck$.next(false);
        this.changeDetectionRef.markForCheck();
      });
  }

  ngOnDestroy() {
    // Clear the FormControl list from 'cards'
    this.deckForm.controls.cards.clear();
    // Put every form field on its default value
    this.deckForm.reset();
  }

  handleCreateDeck() {
    this.editorService.applyDeckToIdb();
  }

  handleOpenDialog(index: number) {
    this.editorService.openCardDialog(index);
  }

  handleExportCsv() {
    this.editorService.exportCsvFile();
  }

  onSearchTextChange(event: Event) {
    this.editorService.searchText = (event.target as HTMLInputElement).value;
  }

  async onCsvFileSelected(event: Event) {
    this.loadingDeck$.next(true);

    const files = (event.target as HTMLInputElement).files;
    if (!files) {
      throw Error('File not found');
    }

    try {
      await this.editorService.importCsvFile(files[0]);
    } catch (err: any) {
      console.error(err.message);
    }

    // Because the import method is async, we need to tell when this
    // component needs to be rerendered.
    this.changeDetectionRef.markForCheck();
    this.loadingDeck$.next(false);
  }
}
