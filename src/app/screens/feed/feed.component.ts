import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Card, Deck } from '@models/database.model';
import { StorageService } from '@services/storage.service';
import { BehaviorSubject, Subject, combineLatest, filter, map, switchMap, take } from 'rxjs';
import { FSRS, Rating } from 'ts-fsrs';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
})
export class FeedComponent {
  private readonly fsrs: FSRS = new FSRS({});

  currentCard$ = new BehaviorSubject<Card | undefined>(undefined);
  list: Array<Card & { toBeReviewed: boolean }>;

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
  ) { }

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
      error: err => console.error(err)
    });
  }

  private _initializeCardList(deck: Deck) {
    this.list = deck.cards
      .sort((a, b) => b.fsrsCard.due.getUTCSeconds() - a.fsrsCard.due.getUTCSeconds())
      .map(curr => ({ ...curr, toBeReviewed: curr.fsrsCard.due < new Date() }));

    this.currentCard$.next(this.list.pop());
  }

  handleFeedback(rating: Rating) {
    const currentCard = this.currentCard$.getValue();

    if (currentCard) {
      const currentCardReviewed = this.fsrs.repeat(currentCard.fsrsCard, new Date());
      // TODO: Save card
    }

    const nextCard = this.list.pop();

    if (nextCard) {
      this.currentCard$.next(nextCard);
    } else {
      console.log('End of review');
    }
  }
}
