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

@Injectable()
export class AccessTokenInterceptor implements HttpInterceptor {

  constructor(private _router: Router) {}

  public intercept(request: HttpRequest<any>, next: HttpHandler)
  : Observable<HttpEvent<any>> {

    request = request.clone({
      url: '/rest' + request.url,
      setParams: {
        'access_token': localStorage.getItem('access_token'),
        'openid': localStorage.getItem('openid')
      }
    });



    return next.handle(request)
      .do(null, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this._router.navigate(['signin']);
          }
        }
      });
  }


}
