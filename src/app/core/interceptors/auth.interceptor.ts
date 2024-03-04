import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenData } from 'src/app/shared/models/user';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    try {
      const tokenData = JSON.parse(localStorage.getItem('token')!) as TokenData;
      if (tokenData?.accessToken) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${tokenData.accessToken}`,
          },
        });
      }
      return next.handle(request);
    } catch {
      return next.handle(request);
    }
  }
}
