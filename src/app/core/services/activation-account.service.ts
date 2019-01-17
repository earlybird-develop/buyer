import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { AESService } from './aes.service';
// tslint:disable-next-line:max-line-length
const ResetPassword_Url = '/service/flush_password';

@Injectable()
export class ActivationAccountService {

  // tslint:disable-next-line:max-line-length
  constructor(private _http: HttpClient, private aesService: AESService) { }

  public make(httpParams: Object): Observable<any> {

    const data = {
      newpassword: httpParams['passwordInfo'].password,
      confirmpassword: httpParams['passwordInfo'].checkPassword
    };

    const params = new HttpParams()
      .set('verify_code', httpParams['passwordInfo'].verify_code)
      .set('type', httpParams['passwordInfo'].type);
    var encryptData = this.aesService.encrypt(data);
    return Observable.create((observer: Observer<any>) => {
      this._http
        .post(ResetPassword_Url, encryptData, { params })
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
