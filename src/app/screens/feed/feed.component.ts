import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Card, Deck } from '@models/database.model';
import { StorageService } from '@services/storage.service';
import { combineLatest, filter, map, switchMap, take } from 'rxjs';
import { FSRS } from 'ts-fsrs';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
})
export class FeedComponent {
  private readonly fsrs = new FSRS({});

  index: number = 0;
  list: Array<Card> = [];
  deckTitle: string;

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
    private changeDetectionRef: ChangeDetectorRef,
  ) { }

  private _initializeCardList(deck: Deck) {
    this.deckTitle = deck.name;
    this.list = deck.cards.sort((a, b) => {
      const dateA = a.fsrsCard.due.getUTCSeconds();
      const dateB = b.fsrsCard.due.getUTCSeconds();

      return dateB - dateA;
    });
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
      next: deck => this._initializeCardList(deck),
      error: err => console.error(err),
      complete: () => this.changeDetectionRef.markForCheck(),
    });
  }

  get currentCard() {
    return this.list.at(this.index);
  }

  handleFeedback(rating: 1 | 2 | 3 | 4) {
    if (this.currentCard) {
      const scheduler = this.fsrs.repeat(this.currentCard.fsrsCard, new Date());
      this.currentCard.fsrsCard = scheduler[rating].card;
      this.currentCard.log = scheduler[rating].log;
    }

    if (this.index === this.list.length - 1) {
      this.index = 0;
    } else {
      this.index++;
      
    }
  }
}
