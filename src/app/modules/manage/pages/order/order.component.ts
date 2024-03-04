import { AsyncPipe, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { debounceTime, of, switchMap } from 'rxjs';
import { DialogService } from 'src/app/shared/components/dialog/dialog.service';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { ToggleComponent } from 'src/app/shared/components/toggle/toggle.component';
import { InvoiceDetail, InvoiceResult } from 'src/app/shared/models/invoice';
import Swal from 'sweetalert2';
import { InvoiceService } from '../../services/invoice.service';
import { OrderDetailDialogComponent } from './order-detail-dialog/order-detail-dialog.component';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [AsyncPipe, PaginationComponent, NgClass, ToggleComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  pageNumber = 1;
  pageSize = 7;
  totalItems = 0;
  constructor(public invoiceService: InvoiceService, private dialogService: DialogService) {}

  ngOnInit(): void {
    this.getList();
  }

  getList(search?: string) {
    this.invoiceService
      .getListInvoices({
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        search,
        sortBy: 'createdDate',
        sortOrder: 'DESC',
      })
      .pipe(
        debounceTime(600),
        switchMap((res) => {
          this.totalItems = res.data.pageInfo.totalItemsCount;
          return of(null);
        }),
      )
      .subscribe();
  }

  calculateTotalPrice(invoiceDetails: InvoiceDetail[]) {
    return invoiceDetails.reduce((acc, curr) => (acc += curr.totalPrice), 0);
  }

  onPageChange(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.getList();
  }

  onChangeInvoiceCode(event: any) {
    this.getList(event.target.value);
  }

  onChangeInvoiceStatus(event: boolean) {
    // this.dialogService.open(InvoiceDetailDialogComponent, { backdropClass: 'bg-black', hasBackdrop: true });
  }

  approveInvoice(invoiceId: string) {
    this.invoiceService
      .approveInvoice(invoiceId)
      .pipe(
        switchMap(() => this.invoiceService.getListInvoices({ pageNumber: this.pageNumber, pageSize: this.pageSize })),
      )
      .subscribe();
  }

  showInvoiceDetail(invoice: InvoiceResult) {
    this.dialogService.open(
      OrderDetailDialogComponent,
      {
        hasBackdrop: true,
        panelClass: 'w-[90vw]'
      },
      invoice,
    );
  }
}
