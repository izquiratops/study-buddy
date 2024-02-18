import { Pipe, PipeTransform } from '@angular/core';
import { ProcessedDecks } from '@models/database.model';

@Pipe({
  name: 'filterDecksByText'
})
export class FilterDecksByTextPipe implements PipeTransform {
  transform(items: ProcessedDecks, filterValue: string): ProcessedDecks {
    console.debug("Running pipe decks", filterValue);

    if (items.length === 0 || !filterValue) {
      return items;
    }

    return items.filter(item => {
      return item.name.toLowerCase().includes(filterValue.toLowerCase());
    });
  }
}
