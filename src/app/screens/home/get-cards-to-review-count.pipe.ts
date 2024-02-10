import { Pipe, PipeTransform } from '@angular/core';
import { FlashCards } from '@models/database.model';

@Pipe({
  name: 'getCardsToReviewCount',
  standalone: true
})
export class GetCardsToReviewCountPipe implements PipeTransform {

  transform(flashCards: FlashCards): number {
    return flashCards.reduce((acc, curr) => {
      if (curr.card.due < new Date()) {
        acc++;
      }

      return acc;
    }, 0);
  }

}
