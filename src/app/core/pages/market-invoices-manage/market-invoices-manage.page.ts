import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { Invoice, InvoicesFilter, MarketStat } from '../../models';
import { InvoicesService } from '../../services';

@Component({
  selector: 'eb-market-invoices-manage',
  templateUrl: './market-invoices-manage.page.html',
  styleUrls: ['./market-invoices-manage.page.scss']
})
export class MarketInvoicesManagePage implements OnInit {

  private _marketId: string;

  public invoicesSearch = '';

  public startDate: string;
  public endDate: string;

  public filter = new InvoicesFilter();

  public marketStat: MarketStat;
  public invoices: Invoice[];

  constructor(private _invoicesService: InvoicesService,
              private _route: ActivatedRoute,
              private _toastr: ToastrService) {
    this._marketId = this._route.parent.snapshot.params.id;
  }

  ngOnInit() {
    this.load();
  }

  public load(): void {
    this._invoicesService
      .getMarketStat(this._marketId, this.filter)
      .subscribe(
        x => this.marketStat = x,
        () => this._toastr.error('Internal server error')
      );

    this._invoicesService
      .getList(this._marketId, this.filter)
      .subscribe(
        x => this.invoices = x,
        () => this._toastr.error('Internal server error')
      );
  }

  public setInvoiceType(status: string) {
    this.filter.invoiceStatus = status;

    this.load();
  }

  public goCustomRange(): void {
    const pipe = new DatePipe('EN');
    this.filter.startDate = pipe.transform(this.startDate, 'yyyy-MM-dd');
    this.filter.endDate = pipe.transform(this.endDate, 'yyyy-MM-dd');

    this.load();
  }

  public toggleDpe(id: number, e: Event): void {
    this.filter.toggleDpe(id, e);
    this.load();
  }

  public toggleAmount(id: number, e: Event): void {
    this.filter.toggleAmount(id, e);
    this.load();
  }

  public setCheckedInvoices(e: Event): void {
    this.invoices.map(x => x._checked = e.target['checked']);
  }

  public changeStatus(type: number): void {
    const ids = this.invoices
      .filter(x => x._checked)
      .map(x => x.invId);

    this._invoicesService
      .setAdjustment(this._marketId, ids, type)
      .subscribe(
        () => this.load(),
        errors => {
          const invoicesIds = this.invoices
            .filter(x => errors.indexOf(x.invId) >= 0)
            .map(x => x.invoiceId)
            .join(', ');

          this._toastr
            .warning(`Invoices with next ID's not updated: ${invoicesIds}`);
        }
      );
  }

  public syncInvoices(): void {
    this._invoicesService
      .syncInvoices(this._marketId)
      .subscribe(
        () => this._toastr.success('Invoices successfully synchronized'),
        () => this._toastr.error('Internal server error')
      );
  }
}
