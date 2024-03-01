import { ChangeDetectorRef, Component, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, filter, map, switchMap, take } from 'rxjs';
import { StorageService } from '@services/storage.service';
import { EditorService } from './editor.service';
import { NewDeck } from '@models/database.model';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
})
export class EditorComponent {
  constructor(
    private route: ActivatedRoute,
    private viewContainerRef: ViewContainerRef,
    private changeDetectionRef: ChangeDetectorRef,
    private storageService: StorageService,
    private editorService: EditorService
  ) {
    this.editorService.viewContainerRef = viewContainerRef;
  }

  get deckForm() {
    return this.editorService.deckForm;
  }

  get submitButtonLabel() {
    return this.deckForm.get('idbKey')!.value === -1
      ? 'Create Deck'
      : 'Apply Changes';
  }

  get nameControl() {
    return this.deckForm.get('name')!;
  }

  get hasCards() {
    return this.deckForm.get('cards')!.value.length > 0;
  }

  ngOnInit() {
    combineLatest([this.route.queryParams, this.storageService.onIdbReady$])
      .pipe(
        filter(([params, isReady]) => Object.hasOwn(params, 'id') && isReady),
        map(([params, _]) => Number.parseInt(params['id'])),
        switchMap((id) => this.storageService.getDeck(id)),
        take(1)
      )
      .subscribe({
        next: (deck) => {
          this.editorService.importDeck(deck);
          this.changeDetectionRef.markForCheck();
        },
        error: (err) => console.error(err),
      });
  }

  ngOnDestroy() {
    this.editorService.clearForm();
  }

  handleCreateDeck() {
    const formValue = this.editorService.deckForm.value;

    if (formValue.idbKey === -1) {
      delete formValue.idbKey;
    }

    this.storageService.setDeck(formValue as NewDeck);
  }

  handleOpenDialog(index: number) {
    this.editorService.openCardDialog(index);
  }

  onSearchTextChange(event: Event) {
    this.editorService.searchText = (event.target as HTMLInputElement).value;
  }

  async onCsvFileSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files) {
      throw Error('File not found');
    }

    await this.editorService.importCsvFile(files[0]);
    this.changeDetectionRef.markForCheck();
  }
}
