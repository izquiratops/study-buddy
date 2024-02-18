import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FlashCard } from '@models/database.model';

@Pipe({
  name: 'filterByText'
})
export class FilterByTextPipe implements PipeTransform {
  transform(items: Array<FormControl<FlashCard>>, filterValue: string): any[] {
    console.debug("running pipe", filterValue);

    if (items.length === 0 || !filterValue) {
      return items;
    }

    const search = (value: string) => {
        return value.toLowerCase().includes(filterValue.toLowerCase());
    }

    return items.filter(item => search(item.value.content.front) || search(item.value.content.back));
  }
}
