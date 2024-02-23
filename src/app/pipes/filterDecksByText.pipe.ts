import { Pipe, PipeTransform } from '@angular/core';
import { ProcessedDecks } from '@models/database.model';

@Pipe({
  name: 'filterDecksByText'
})
export class FilterDecksByTextPipe implements PipeTransform {
  transform(items: ProcessedDecks | null, filterValue: string): ProcessedDecks {
    console.debug("Running filter pipe decks", filterValue);

    if (!items) {
      return [];
    }

    if (items.length === 0 || !filterValue) {
      return items;
    }

    return items.filter(item => {
      return item.name.toLowerCase().includes(filterValue.toLowerCase());
    });
  }
}
