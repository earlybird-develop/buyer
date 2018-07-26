import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { HistoryMarket, Award } from '../models';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';


const MARKET_HISTORY_STAT_PATH = '/history/get_market_stat';
const HISTORY_AWARDED_LIST = '/history/get_awarded_list';
const DOWNLOAD_AWARDED_DETAILS = '/history/download_awarded_detail';
const MARKET_GRAPH_PATH = '/history/get_market_graph';

@Injectable()
export class MarketHistoryService {

  constructor(private _http: HttpClient) { }

  public get(id: string, filter: Object): Observable<HistoryMarket> {
    let params = new HttpParams().set('market_id', id);

    Object.keys(filter)
      .filter(x => !!filter[x])
      .forEach(key => params = params.set(key, filter[key]));

    return Observable.create((observer: Observer<HistoryMarket>) => {
      this._http
        .get(MARKET_HISTORY_STAT_PATH, { params: params })
        .subscribe(
          resp => observer.next(new HistoryMarket(resp['data'])),
          errors => observer.error(errors)
        );
    });
  }

  public getMarketGraph(id: string, filter: Object): Observable<Award[]> {
    let params = new HttpParams().set('market_id', id);

    Object.keys(filter)
      .filter(x => !!filter[x])
      .forEach(key => params = params.set(key, filter[key]));

    return Observable.create((observer: Observer<Award[]>) => {
      this._http
        .get(MARKET_GRAPH_PATH, { params: params })
        .subscribe(
          resp => observer.next(resp['data']),
          errors => observer.error(errors)
        );
    });
  }

  public getAwardedList(id: string, filter: Object): Observable<Award[]> {
    let params = new HttpParams().set('market_id', id);

    Object.keys(filter)
      .filter(x => !!filter[x])
      .forEach(key => params = params.set(key, filter[key]));

    return Observable.create((observer: Observer<Award[]>) => {
      this._http
        .get(HISTORY_AWARDED_LIST, { params: params })
        .subscribe(
          resp => observer.next(resp['data'].map(x => new Award(x))),
          errors => observer.error(errors)
        );
    });
  }

  public downloadAwardedDetailsCsv(id: string)
  : Observable<string> {
    const params = new HttpParams()
      .set('award_id', id)
      .set('type', 'csv');

    return Observable.create((observer: Observer<string>) => {
      this._http
        .get(DOWNLOAD_AWARDED_DETAILS, { params: params, responseType: 'text' })
        .subscribe(
          resp => observer.next(resp),
          errors => observer.error(errors)
        );
    });
  }

  public downloadAwardedDetailsExcel(id: string)
  : Observable<any> {

    const params = new HttpParams()
      .set('award_id', id)
      .set('type', 'excel');

    return Observable.create((observer: Observer<any>) => {
      this._http
        .get(DOWNLOAD_AWARDED_DETAILS, {
          params: params,
          responseType: 'arraybuffer'
        })
        .subscribe(
          resp => observer.next(resp),
          errors => observer.error(errors)
        );
    });
  }
}
