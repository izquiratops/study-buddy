import { Component, ViewContainerRef } from '@angular/core';
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
    private storageService: StorageService,
    private editorService: EditorService,
  ) {
    this.editorService.viewContainerRef = viewContainerRef;
  }

  get deckForm() {
    return this.editorService.deckForm;
  }

  get hasCards() {
    return this.deckForm.get('cards')!.value.length > 0;
  }

  get isNewCard() {
    return this.deckForm.get('idbKey')!.value === -1;
  }

  get nameControl() {
    return this.deckForm.get('name')!;
  }

  ngOnInit() {
    combineLatest([
      this.route.queryParams,
      this.storageService.onIdbReady$
    ]).pipe(
      filter(([params, isReady]) => Object.hasOwn(params, 'id') && isReady),
      map((([params, _]) => Number.parseInt(params['id']))),
      switchMap((id) => this.storageService.getDeck(id)),
      take(1),
    ).subscribe({
      next: deck => this.editorService.populateForm(deck),
      error: err => console.error(err)
    });
  }

  ngOnDestroy() {
    this.deckForm.reset();
    this.deckForm.controls.cards.clear();
  }

  handleCreateDeck() {
    const formValue = this.editorService.deckForm.value;

    if (formValue.idbKey === -1) {
      delete formValue.idbKey;
    }

    this.storageService.setDeck(formValue as NewDeck);
  };

  handleOpenDialog() {
    this.editorService.openCardDialog();
  }
}
