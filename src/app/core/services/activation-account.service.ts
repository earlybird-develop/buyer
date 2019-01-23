import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

const ResetPassword_Url = '/service/flush_password';

@Injectable()
export class ActivationAccountService {

  constructor(private _http: HttpClient) { }

  public make(httpParams: Object): Observable<any> {

    const data = {
      newpassword: httpParams['passwordInfo'].password,
      confirmpassword: httpParams['passwordInfo'].checkPassword
    };

    const params = new HttpParams()
      .set('verify_code', httpParams['passwordInfo'].verify_code)
      .set('type', httpParams['passwordInfo'].type);
    return Observable.create((observer: Observer<any>) => {
      this._http
        .post(ResetPassword_Url, data, { params })
        .subscribe(
          () => {
            observer.next(true);
            observer.complete();
          },
          error => observer.error(error)
        );
    });
  }
}
