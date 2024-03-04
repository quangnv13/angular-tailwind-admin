import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class HttpService {
  apiUrl = window.backendBaseApiUrl;

  constructor(private httpClient: HttpClient) {}

  get<T>(
    endPoint: string,
    options?: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      reportProgress?: boolean;
      withCredentials?: boolean;
    },
  ): Observable<T> {
    return this.httpClient.get<T>(`${this.apiUrl}/${endPoint}`, options);
  }

  post<T>(
    endPoint: string,
    body: any,
    options?: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      reportProgress?: boolean;
      withCredentials?: boolean;
    },
  ): Observable<T> {
    return this.httpClient.post<T>(`${this.apiUrl}/${endPoint}`, body, options);
  }

  // postUpload<T>(url: string, body: any, type: EFileType): Observable<DataResponse<T>> {
  //   const params = new HttpParams().set('type', type).set('callApiType', 'background');
  //   const request = new HttpRequest('POST', url, body, {
  //     reportProgress: true,
  //     responseType: 'json',
  //     params,
  //   });

  //   return this.httpClient.request(request).pipe(
  //     concatMap((response: any) => {
  //       if (response.type === HttpEventType.Response) {
  //         const res = new DataResponse<T>(response.body);
  //         return of(res);
  //       }
  //       return of(response);
  //     }),
  //   );
  // }

  // put<T>(
  //   endPoint: string,
  //   body: any,
  //   options?: {
  //     headers?:
  //       | HttpHeaders
  //       | {
  //           [header: string]: string | string[];
  //         };
  //     params?:
  //       | HttpParams
  //       | {
  //           [param: string]: string | string[];
  //         };
  //     reportProgress?: boolean;
  //     withCredentials?: boolean;
  //   },
  // ): Observable<DataResponse<T>> {
  //   const bodyOrigin = new DataPush(body);
  //   return this.httpClient.put(`${this.apiUrl}/${endPoint}`, bodyOrigin.data, options).pipe(
  //     switchMap((response) => {
  //       const res = new DataResponse<T>(response);
  //       return of(res);
  //     }),
  //   );
  // }

  delete<T>(
    endPoint: string,
    options?: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      reportProgress?: boolean;
      withCredentials?: boolean;
    },
  ): Observable<T> {
    return this.httpClient.delete<T>(`${this.apiUrl}/${endPoint}`, options);
  }
}
