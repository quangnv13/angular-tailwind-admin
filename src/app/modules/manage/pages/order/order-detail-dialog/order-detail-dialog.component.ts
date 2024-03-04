import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { of, switchMap, tap } from 'rxjs';
import { formatCurrency } from 'src/app/core/utils/utils';
import { DIALOG_DATA, DialogData } from 'src/app/shared/components/dialog/dialog.service';
import { InvoiceResult } from 'src/app/shared/models/invoice';
import { Dropship } from 'src/app/shared/models/product-design';
import { CalculateTotalPricePipe } from 'src/app/shared/pipes/calculate-total-price.pipe';
import { FormatCurrencyPipe } from 'src/app/shared/pipes/format-currency.pipe';
import Swal from 'sweetalert2';
import { InvoiceService } from '../../../services/invoice.service';
import { ItemDesignComponent } from '../item-design/item-design.component';

@Component({
  selector: 'app-order-detail-dialog',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe, ItemDesignComponent, CalculateTotalPricePipe, FormatCurrencyPipe, NgClass],
  templateUrl: './order-detail-dialog.component.html',
  styleUrl: './order-detail-dialog.component.scss',
  providers: [AsyncPipe, CalculateTotalPricePipe],
})
export class OrderDetailDialogComponent implements OnInit {
  itemDetails?: Dropship[];
  constructor(
    @Inject(DIALOG_DATA) public dialogData: DialogData<InvoiceResult>,
    private invoiceService: InvoiceService,
    private asyncPipe: AsyncPipe,
    private calculateTotalPricePipe: CalculateTotalPricePipe,
  ) {}

  async ngOnInit() {
    const data = await Promise.all(
      this.dialogData.data.invoiceDetails.map((d) => {
        return this.invoiceService
          .getInvoiceDropshipDetail(d.itemId)
          .pipe(switchMap((res) => of(res.data)))
          .toPromise();
      }),
    );
    this.itemDetails = data as Dropship[];
  }

  approveInvoice(invoiceId: string) {
    return this.invoiceService.approveInvoice(invoiceId);
  }

  showConfirmPaidApprove() {
    const invoice: InvoiceResult = this.dialogData.data;
    Swal.fire({
      icon: 'warning',
      html: `
        Bạn có chắc chắn muốn duyệt thanh toán cho hoá đơn này và đẩy sang cho bộ phận in xử lý <b>${invoice.code}</b>
        <p>Thông tin hoá đơn</p>
        <p>Người tạo: <b>${invoice.fullName || 'Khách'}</b></p>
        <p>Tổng tiền: <b>${formatCurrency(this.calculateTotalPricePipe.transform(invoice.invoiceDetails))}</b></p>
        <p class="text-red-500">Lưu ý: Kiểm tra kỹ thông tin và hãy đảm bảo đã nhận được đúng số tiền qua tài khoản ngân hàng</p>
      `,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: `
        Duyệt
      `,
      cancelButtonText: `
        Huỷ
      `,
    }).then((res) => {
      if (res.isConfirmed) {
        this.approveInvoice(invoice.id)
          .pipe(tap(() => this.dialogData.close(true)))
          .subscribe();
      }
    });
  }

  showConfirmApprove() {
    const invoice: InvoiceResult = this.dialogData.data;
    Swal.fire({
      icon: 'warning',
      html: `
        Bạn có chắc chắn muốn duyệt hoá đơn này và đẩy sang cho bộ phận in xử lý <b>${invoice.code}</b>
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
      `,
    }).then((res) => {
      if (res.isConfirmed) {
        this.approveInvoice(invoice.id)
          .pipe(tap(() => this.dialogData.close(true)))
          .subscribe();
      }
    });
  }
}
