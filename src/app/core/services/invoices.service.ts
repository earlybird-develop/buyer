import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Model } from 'tsmodels';
import { Invoice, InvoicesFilter, MarketStat } from '../models';


const MARKET_STAT_PATH = '/invoice/get_market_stat';
const GET_INVOICES_LIST_PATH = '/invoice/get_invoices_list';
const SET_INVOICES_ELIGIABLE_PATH = '/invoice/set_invoices_eligiable';
const SYNC_INVOICES_PATH = '/invoice/sync_market_invoices';

@Injectable()
export class InvoicesService {

  constructor(private _http: HttpClient) { }

  public getMarketStat(marketId: string, filter: InvoicesFilter)
  : Observable<MarketStat> {

    let params = new HttpParams().set('market_id', marketId);
    const filterObject = filter._toJSON();

    let keys = Object.keys(filterObject);

    if (filter.invoiceStatus !== 'eligible') {
      keys = ['invoice_status'];
    }

    keys
      .filter(x => !!filterObject[x])
      .forEach(key => params = params.set(key, filterObject[key]));

    return Observable.create((observer: Observer<MarketStat>) => {
      this._http
        .get(MARKET_STAT_PATH, { params })
        .subscribe(
          res => {
            observer.next(Model.new<MarketStat>(MarketStat, res['data']));
            observer.complete();
          },
          errors => observer.error(errors)
        );
    });
  }

  public getList(marketId: string, filter: InvoicesFilter)
  : Observable<Invoice[]> {

    let params = new HttpParams().set('market_id', marketId);
    const filterObject = filter._toJSON();

    let keys = Object.keys(filterObject);

    if (filter.invoiceStatus !== 'eligible') {
      keys = ['invoice_status'];
    }

    keys
      .filter(x => !!filterObject[x])
      .forEach(key => params = params.set(key, filterObject[key]));

    return Observable.create((observer: Observer<Invoice[]>) => {
      this._http
        .get(GET_INVOICES_LIST_PATH, { params })
        .subscribe(
          res => {
            observer.next(
              Model.newCollection<Invoice>(Invoice, res['data']['list'])
            );
            observer.complete();
          },
          errors => observer.error(errors)
        );
    });
  }

  public setAdjustment(marketId: string, ids: string[], type: number)
  : Observable<boolean> {
    const params = new HttpParams().set('market_id', marketId);

    const body = { 'inv_id': ids, 'is_eligiable': type };

    return Observable.create((observer: Observer<boolean>) => {
      this._http
        .post(SET_INVOICES_ELIGIABLE_PATH, body, { params })
        .subscribe(
          res => {
            if (res['code'] === 0) {
              observer.error(res['data']);
            } else {
              observer.next(true);
              observer.complete();
            }
          },
          errors => observer.error(errors)
        );
    });
  }

  public syncInvoices(marketId: string): Observable<boolean> {
    const params = new HttpParams().set('market_id', marketId);

    return Observable.create((observer: Observer<boolean>) => {
      this._http
        .get(SYNC_INVOICES_PATH, { params })
        .subscribe(
          () => {
            observer.next(true);
            observer.complete();
          },
            errors => observer.error(errors)
        );
    });
  }
}
