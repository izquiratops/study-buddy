import { FormControl, FormGroup } from '@angular/forms';
import { Card as FsrsCard, ReviewLog, createEmptyCard } from 'ts-fsrs';

export type CardForm = FormGroup<CardFormProps>;

type CardFormProps = {
  front: FormControl<string>;
  back: FormControl<string>;
};

export type Cards = Array<Card>;

export class Card {
  fsrsCard: FsrsCard;
  content: CardContent;
  log?: ReviewLog; // Logs are empty on new cards

  constructor(init?: Partial<Card>) {
    Object.assign(this, init);

    // Initializes a new card with new FSRS values
    if (this.fsrsCard === undefined) {
      this.clearStats();
    }
  }

  clearStats() {
    this.fsrsCard = createEmptyCard();
    this.log = undefined;
  }
}

export class CardContent {
  front = '';
  back = '';

  constructor(init?: CardContent) {
    Object.assign(this, init);
  }
}
