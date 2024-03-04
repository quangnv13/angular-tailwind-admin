import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize, tap, timeout } from 'rxjs';
import { SpinLoaderService } from '../services/spin-loader.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  count = 0;

  constructor(private spinLoaderService: SpinLoaderService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { params } = request;
    if (params.get('callApiType') !== 'background') {
      if (this.count === 0) {
        this.spinLoaderService.show();
      }
      this.count++;
      return next.handle(request).pipe(
        finalize(() => {
          this.count--;
          if (this.count === 0) {
            this.spinLoaderService.hide();
          }
        }),
      );
    }
    return next.handle(request);
  }
}
