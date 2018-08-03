import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { UserProfile, ForegtPasswordEmail } from '../models';

const GET_ACCESS_TOKEN_PATH = '/oauth2/get_access_token';
const GET_PROFILE_PATH = '/account/get_profile';
const UPDATE_PROFILE_PATH = '/account/update_profile';
const FORGET_PASSWORD_EMAIL_SEND = '/service/reset_password';

@Injectable()
export class AccountService {

  constructor(private _http: HttpClient, private _router: Router) { }

  public getAccessToken(httpParams: Object): Observable<boolean> {
    const params = new HttpParams()
        .set('username', httpParams['email'])
        .set('password', httpParams['password'])
        .set('appid', 'cisco')
        .set('secret', '123456')
        .set('grant_type', 'password');

    return Observable.create((observer: Observer<boolean>) => {
      this._http
        .get(GET_ACCESS_TOKEN_PATH, { params })
        .subscribe(
          resp => {
            localStorage.setItem('access_token', resp['access_token']);
            localStorage.setItem('expire_time', resp['expire_time']);
            localStorage.setItem('openid', resp['openid']);
            localStorage.setItem('refresh_token', resp['refresh_token']);
            observer.next(true);
            observer.complete();
          },
          error => observer.error(error)
        );
    });
  }

  public getProfile(): Observable<UserProfile> {
    return Observable.create((observer: Observer<UserProfile>) => {
      this._http
        .get(GET_PROFILE_PATH)
        .subscribe(
          resp => {
            localStorage.setItem('user_name', resp['data']['name']);
            observer.next(UserProfile.new(UserProfile, resp['data']));
            observer.complete();
          },
          errors => observer.error(errors)
        );
    });
  }

  public updateProfile(profile: UserProfile): Observable<UserProfile> {
    return Observable.create((observer: Observer<UserProfile>) => {
      this._http
        .post(UPDATE_PROFILE_PATH, { data: profile._toJSON() })
        .subscribe(
          resp => {
            observer.next(<UserProfile>{});
            observer.complete();
          },
          errors => observer.error(errors)
        );
    });
  }

  public postForgetPasswordMail(email): Observable<ForegtPasswordEmail>{
    return Observable.create((observer : Observer<ForegtPasswordEmail>) => {
      this._http
        .post(FORGET_PASSWORD_EMAIL_SEND, email)
        .subscribe(
          resp => {
            observer.next(<ForegtPasswordEmail>{});
            observer.complete();
          },
          errors => observer.error(errors)
        )
    });
  }

}
