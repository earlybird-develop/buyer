import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import * as CryptoJS from 'crypto-js';
const aseKey = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFG';

@Injectable()
export class AccessTokenInterceptor implements HttpInterceptor {

  constructor(private _router: Router) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler)
    : Observable<HttpEvent<any>> {
    // if (request.body) {
    //   var encryptValue = this.encrypt(request.body);
    //   request = request.clone({
    //     url: '/rest' + request.url,
    //     setParams: {
    //       'access_token': localStorage.getItem('access_token'),
    //       'openid': localStorage.getItem('openid')
    //     },
    //     body: encryptValue
    //   });
    // } else {
      request = request.clone({
        url: '/rest' + request.url,
        setParams: {
          'access_token': localStorage.getItem('access_token'),
          'openid': localStorage.getItem('openid')
        }
      });
    // }

    return next.handle(request)
      .do(null, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this._router.navigate(['signin']);
            return;
          }
        }
      });
  }

  public encrypt(value: any) {
    if (typeof value == 'object') {
      value = JSON.stringify(value);
    }
    var encryptValue = CryptoJS.AES.encrypt(value, CryptoJS.enc.Utf8.parse(aseKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString();

    return encryptValue;
  }
  public decrypt(encrypt: any) {
    var decryptValue = CryptoJS.AES.decrypt(encrypt, CryptoJS.enc.Utf8.parse(aseKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);

    return decryptValue;
  }
}
