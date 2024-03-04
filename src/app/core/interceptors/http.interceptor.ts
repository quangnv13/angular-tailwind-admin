import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Injectable()
export class HttpCallInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenAttempts = 0;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(this.addAuthenticationToken(request)).pipe(
      catchError((error) => {
        console.log(error);
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            return this.handle401Error(request, next);
          }
          if (error.status >= 500) {
            this.toastr.error('Có lỗi xảy ra vui lòng thử lại sau');
          }
          if (error.status === 404) {
            this.router.navigate(['/']);
          }
        }
        return throwError(() => new Error(error));
      }),
    );
  }

  private addAuthenticationToken(request: HttpRequest<unknown>): HttpRequest<unknown> {
    const token = this.authService.getToken()?.accessToken;
    if (!token) {
      return request;
    }
    return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      this.refreshTokenAttempts = 0;

      return this.authService.refreshToken().pipe(
        switchMap((res) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(res.data.accessToken);
          return next.handle(this.addAuthenticationToken(request));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.refreshTokenAttempts++;
          if (this.refreshTokenAttempts >= 2) {
            this.authService.logout();
          }
          return throwError(() => new Error(error));
        }),
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap(() => {
          return next.handle(this.addAuthenticationToken(request));
        }),
      );
    }
  }
}
