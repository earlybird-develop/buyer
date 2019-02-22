import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Model } from 'tsmodels';
import { Award, CurrentMarket, SuppliersNetworkStat } from '../models';
import { CurrentMarketStat } from '../models';

const GET_MARKET_STAT_PATH = '/market/get_market_stat';
const GET_MARKET_CURRENT_STAT_PATH = '/market/get_market_current_stat';
const GET_MARKET_SUPPLIER_STAT_PATH = '/market/get_market_supplier_stat';
const GET_MARKET_GRAPH_PATH = '/market/get_market_graph';

@Injectable()
export class CurrentMarketService {
  constructor(public _http: HttpClient) { }

  public getMarket(marketId: string): Observable<CurrentMarket> {
    const params = new HttpParams().set('market_id', marketId);

    return Observable.create((observer: Observer<CurrentMarket>) => {
      this._http
        .get(GET_MARKET_STAT_PATH, { params: params })
        .subscribe(
          resp => {
            observer.next(Model.new(CurrentMarket, resp['data']));
            observer.complete();
          },
          errors => observer.error(errors)
        );
    });
  }

  public getMarketStat(marketId: string): Observable<CurrentMarketStat> {
    const params = new HttpParams().set('market_id', marketId);

    return Observable.create((observer: Observer<CurrentMarketStat>) => {
      this._http
        .get(GET_MARKET_CURRENT_STAT_PATH, { params: params })
        .subscribe(
          resp => {
            observer.next(Model.new(CurrentMarketStat, resp['data']));
            observer.complete();
          },
          errors => observer.error(errors)
        );
    });
  }

  public getSupplierNetworkStat(marketId: string)
    : Observable<SuppliersNetworkStat> {
    const params = new HttpParams().set('market_id', marketId);

    return Observable.create((observer: Observer<SuppliersNetworkStat>) => {
      this._http
        .get(GET_MARKET_SUPPLIER_STAT_PATH, { params: params })
        .subscribe(
          resp => {
            observer.next(Model.new(SuppliersNetworkStat, resp['data']));
            observer.complete();
          },
          errors => observer.error(errors)
        );
    });
  }

  public getMarketGraph(id: string, filter?: Object): Observable<Award[]> {
    const params = new HttpParams().set('market_id', id);
    // todo : enable : broken backend
    // Object.keys(filter)
    //   .forEach(key => params = params.set(key, filter[key]));
    return Observable.create((observer: Observer<Award[]>) => {
      this._http
        .get(GET_MARKET_GRAPH_PATH, { params: params })
        .subscribe(
          resp => observer.next(resp['data']['list']),
          errors => observer.error(errors)
        );
    });
  }
}
