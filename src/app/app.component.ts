import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import {
  Card,
  createEmptyCard,
  generatorParameters,
  FSRSParameters,
  FSRS,
  RecordLog,
  Rating,
} from "ts-fsrs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'flashcard-friend';

  ngOnInit() {
    const params = generatorParameters({ maximum_interval: 36500 });
    console.debug(params);
    const f = new FSRS(params);
    let scheduling_cards: any;
    let newCard: any;

    scheduling_cards = f.repeat(createEmptyCard(), new Date());
    newCard = scheduling_cards[Rating.Hard];
    console.debug('After hitting Hard', JSON.stringify(newCard, null, 2));

    scheduling_cards = f.repeat(newCard.card, new Date());
    newCard = scheduling_cards[Rating.Hard];
    console.debug('After hitting Hard', JSON.stringify(newCard, null, 2));

    scheduling_cards = f.repeat(newCard.card, new Date());
    newCard = scheduling_cards[Rating.Easy];
    console.debug('After hitting Easy', JSON.stringify(newCard, null, 2));
  }
}
