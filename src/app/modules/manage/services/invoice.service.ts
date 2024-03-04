import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of, switchMap, throwError } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { DataResponse, PagingDataResponse, PagingOptions } from 'src/app/shared/models/http';
import { InvoiceResult } from 'src/app/shared/models/invoice';
import { DropshipDetailResult, ProductDesignCreate } from 'src/app/shared/models/product-design';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private invoicesSubject: Subject<PagingDataResponse<InvoiceResult>>;
  invoice$: Observable<PagingDataResponse<InvoiceResult>>;
  constructor(private http: HttpService) {
    this.invoicesSubject = new Subject();
    this.invoice$ = this.invoicesSubject.asObservable();
  }

  getListInvoices(options: PagingOptions) {
    return this.http.post<PagingDataResponse<InvoiceResult>>('p4d/api/invoice/paging', options).pipe(
      switchMap((res) => {
        this.invoicesSubject.next(res);
        return of(res);
      }),
    );
  }

  getListOrders(options: PagingOptions) {
    return this.http.post<PagingDataResponse<InvoiceResult>>('p4d/api/order/getorders', options).pipe(
      switchMap((res) => {
        this.invoicesSubject.next(res);
        return of(res);
      }),
    );
  }

  approveInvoice(id: string) {
    return this.http.post<PagingDataResponse<boolean>>('p4d/api/invoice/approve', { id }).pipe(
      switchMap((res) => {
        if (!res.data) {
          throwError(() => new Error('Có lỗi xảy ra khi duyệt hoá đơn'));
        }
        return of(res);
      }),
    );
  }

  getInvoiceDropshipDetail(id: string) {
    return this.http.get<DropshipDetailResult>(`p4d/api/dropshipproduct/${id}`);
  }
}
