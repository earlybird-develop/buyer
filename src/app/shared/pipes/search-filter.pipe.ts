import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
  pure: false
})
export class SearchFilterPipe implements PipeTransform {
  transform(items: any[], field: string, value: any): any[] {
    if (!items) {
      return [];
    }

    return items.filter(
      it => it[field].toString().toLowerCase().indexOf(value.toString().toLowerCase()) >= 0
    );
  }
}
