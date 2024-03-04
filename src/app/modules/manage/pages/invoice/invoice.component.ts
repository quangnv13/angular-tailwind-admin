import { AsyncPipe, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { debounceTime, of, switchMap } from 'rxjs';
import { DialogData, DialogService } from 'src/app/shared/components/dialog/dialog.service';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { ToggleComponent } from 'src/app/shared/components/toggle/toggle.component';
import { InvoiceDetail, InvoiceResult } from 'src/app/shared/models/invoice';
import Swal from 'sweetalert2';
import { InvoiceService } from '../../services/invoice.service';
import { FormatCurrencyPipe } from 'src/app/shared/pipes/format-currency.pipe';
import { OrderDetailDialogComponent } from '../order/order-detail-dialog/order-detail-dialog.component';
import { CalculateTotalPricePipe } from 'src/app/shared/pipes/calculate-total-price.pipe';
import { formatCurrency } from 'src/app/core/utils/utils';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [AsyncPipe, PaginationComponent, NgClass, ToggleComponent, FormatCurrencyPipe, CalculateTotalPricePipe],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss',
  providers: [CalculateTotalPricePipe],
})
export class InvoiceComponent implements OnInit {
  pageNumber = 1;
  pageSize = 7;
  totalItems = 0;
  search = '';
  constructor(
    public invoiceService: InvoiceService,
    private dialogService: DialogService,
    private calculateTotalPricePipe: CalculateTotalPricePipe,
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this.invoiceService
      .getListInvoices({
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        search: this.search,
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
    this.search = event.target.value.trim();
    console.log(this.search);
    this.getList();
  }

  onChangeInvoiceStatus(event: boolean) {}

  approveInvoice(invoiceId: string) {
    this.invoiceService
      .approveInvoice(invoiceId)
      .pipe(
        switchMap(() => this.invoiceService.getListInvoices({ pageNumber: this.pageNumber, pageSize: this.pageSize })),
      )
      .subscribe();
  }

  showConfirmApprove(invoice: InvoiceResult) {
    Swal.fire({
      icon: 'warning',
      html: `
        Bạn có chắc chắn muốn duyệt hoá đơn <b>${invoice.code}</b>
        <p>Thông tin hoá đơn</p>
        <p>Người tạo: <b>${invoice.fullName || 'Khách'}</b></p>
        <p>Tổng tiền: <b>${formatCurrency(this.calculateTotalPricePipe.transform(invoice.invoiceDetails))}</b></p>
        <p class="text-red-500">Lưu ý: Kiểm tra kỹ thông tin</p>
      `,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: `
        Duyệt
      `,
      cancelButtonText: `
        Huỷ
      `
    }).then((res) => {
      if (res.isConfirmed) {
        this.approveInvoice(invoice.id);
      }
    });
  }

  viewInvoiceDetail(invoice: InvoiceResult) {
    const dialog = this.dialogService.open<OrderDetailDialogComponent, DialogData<InvoiceResult>>(
      OrderDetailDialogComponent,
      {
        hasBackdrop: true,
        panelClass: 'w-[90vw]',
      },
      {
        data: invoice,
        close: (result?: boolean) => {
          console.log(result, 'close');
          dialog.dispose();
          if (result) {
            this.getList();
          }
        },
      },
    );
  }
}
