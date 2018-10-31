import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';

import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";

const TRADING_TIME_PATH = '/market/get_trading_time';

@Injectable()
export class TimerService {

  constructor(private _http: HttpClient) { }

  public getTradingTime(): Observable<any>{

    return Observable.create((observer: Observer<any>) => {
      this._http
          .get(TRADING_TIME_PATH)
          .subscribe(
              resp => observer.next(resp['data']['close_time'])
          );
    })
  }

}
