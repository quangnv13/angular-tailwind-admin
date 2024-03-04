import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { storageUtils } from 'src/app/shared/helpers/storage';
import { DataResponse } from 'src/app/shared/models/http';
import { TokenData, User } from 'src/app/shared/models/user';
import { HttpService } from './http.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = window.backendBaseApiUrl;
  private currentUserSubject: BehaviorSubject<User | undefined>;
  currentUser$: Observable<User | undefined>;
  constructor(private httpService: HttpService, private router: Router, private toastr: ToastrService) {
    this.currentUserSubject = new BehaviorSubject<User | undefined>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  getToken(): TokenData | null {
    return storageUtils.get('token');
  }

  setToken(data: TokenData) {
    storageUtils.set('token', data);
  }

  getCurrentUser(): Observable<User | null> {
    const user = (storageUtils.get('currentUser') as User) || null;
    if (user) {
      return of(user);
    }
    return of(null);
  }

  setCurrentUser(value?: User) {
    this.currentUserSubject.next(value);
  }

  getUserInformation() {
    return this.httpService.get<DataResponse<User>>(`user/api/user/getbuyuser`);
  }

  login(userName: string, password: string) {
    return this.httpService.post<DataResponse<TokenData>>('auth/api/identity/login', { userName, password }).pipe(
      switchMap((res) => {
        {
          if (res.data?.accessToken) {
            this.setToken(res.data);
            this.router.navigateByUrl('/');
            return this.getUserInformation();
          } else {
            this.toastr.error('Sai tên đăng nhập hoặc mật khẩu');
          }
          return of(null);
        }
      }),
      tap((res) => {
        this.setCurrentUser(res?.data);
      }),
    );
  }

  refreshToken() {
    return this.httpService.post<DataResponse<TokenData>>('auth/api/identity/refreshtoken', {
      refreshToken: this.getToken()?.refreshToken,
    });
  }

  logout() {
    // return this.httpService.post(`auth/logout`, {}).pipe(finalize(() => this.clearData()));
    this.clearData();
  }

  clearData() {
    storageUtils.clear();
    this.setCurrentUser();
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }
}
