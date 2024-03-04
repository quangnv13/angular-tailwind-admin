import { Pipe, PipeTransform } from '@angular/core';
import { InvoiceDetail } from '../models/invoice';

@Pipe({
  name: 'calculateTotalPrice',
  standalone: true,
})
export class CalculateTotalPricePipe implements PipeTransform {
  transform(value: InvoiceDetail[]): number {
    return this.calculateTotalPrice(value);
  }

  calculateTotalPrice(invoiceDetails: InvoiceDetail[]) {
    return invoiceDetails.reduce((acc, curr) => (acc += curr.totalPrice), 0);
  }
}
