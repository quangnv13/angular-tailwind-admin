import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency } from 'src/app/core/utils/utils';

@Pipe({
  name: 'formatCurrency',
  standalone: true,
})
export class FormatCurrencyPipe implements PipeTransform {
  transform(value: number): string {
    return formatCurrency(value);
  }
}
