import { Pipe, PipeTransform } from '@angular/core';
import { Cards } from '@models/database.model';

@Pipe({
  name: 'filterCardsByText'
})
export class FilterCardsByTextPipe implements PipeTransform {
  transform(items: Cards | undefined, filterValue: string): Cards {
    console.debug("Running pipe cards", filterValue);

    if (!items) {
      return [];
    }

    if (items.length === 0 || !filterValue) {
      return items;
    }

    const search = (value: string) => {
        return value.toLowerCase().includes(filterValue.toLowerCase());
    }

    return items.filter(item => search(item.content.front) || search(item.content.back));
  }
}
