import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

import { Angular2Csv } from 'angular2-csv';
import { BaseChartDirective } from 'ng2-charts';
import { ToastrService } from 'ngx-toastr';

import { Award, HistoryMarket } from '../../models';
import { MarketHistoryService } from '../../services';

@Component({
  selector: 'eb-market-history',
  templateUrl: './market-history.page.html',
  styleUrls: ['./market-history.page.scss']
})
export class MarketHistoryPage implements OnInit {
  public buyId: string;
  public fromDays = 7;
  public filter: { startdate: string, enddate: string };
  public isCustomRange = false;
  public awards: Award[] = [];
  public market: HistoryMarket;
  public graphData: Object[] = [];
  public customFrom: string;
  public customTo: string;

  @ViewChild(BaseChartDirective)
  private _chart: BaseChartDirective;

  // Chart configuration
  public barChartType = 'bar';
  public barChartLabels: string[] = [];
  public barChartData: Object[];
  public barChartOptions: any = {
    responsive: true,
    legend: false,
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        }
      }]
    }
  };

  constructor(private _marketHistory: MarketHistoryService,
              private _route: ActivatedRoute,
              private _toastr: ToastrService) { }

  ngOnInit() {
    this.buyId = this._route.parent.snapshot.params.id;
    this.setDays(7);
  }

  public load(): void {
    this._marketHistory
      .get(this.buyId, this.filter)
      .subscribe(
        x => this.market = x,
        () => this._toastr.error('Internal server error')
      );

    this._marketHistory
      .getAwardedList(this.buyId, this.filter)
      .subscribe(
        x => this.awards = x,
        () => this._toastr.error('Internal server error')
      );

    this._marketHistory
      .getMarketGraph(this.buyId, this.filter)
      .subscribe(
        x => this._chart ? this.chartHandler(x) : null,
        () => this._toastr.error('Internal server error')
      );
  }

  public downloadAwardedDetailsCsv(id: string): void {
    this._marketHistory
      .downloadAwardedDetailsCsv(id)
      .subscribe(
        binData => {
          const a = document.createElement('a');
          document.body.appendChild(a);
          // a.style = "display: none";

          const blob = new Blob(
            [binData],
            { type: 'plain/text' }
          );

          const url = window.URL.createObjectURL(blob);

          a.href = url;
          a.download = 'history.csv';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        () => this._toastr.error('Internal server error')
      );
  }

  public downloadAwardedDetailsExcel(id: string): void {
    this._marketHistory
      .downloadAwardedDetailsExcel(id)
      .subscribe(
        binData => {
          const a = document.createElement('a');
          document.body.appendChild(a);
          // a.style = "display: none";

          const blob = new Blob(
            [binData],
            { type: 'application/vnd.ms-excel' }
          );

          const url = window.URL.createObjectURL(blob);

          a.href = url;
          a.download = 'history.xls';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        () => this._toastr.error('Internal server error')
      );
  }

  public chartHandler(data: Object[]): void {
    this.graphData = data;
    this.barChartLabels = this.graphData.map(x => x['date']);

    this.barChartData = undefined;

    this.barChartData = [
      {
        data: this.graphData.map(x => x['awarded_amount']),
        label: 'Amount',
        hoverBackgroundColor: '#4f7dc9'
      },
      {
        data: this.graphData.map(x => x['awarded_discount']),
        label: 'Discount',
        hoverBackgroundColor: '#e6f0ff'
      }
    ];

    setTimeout(() => this._chart['refresh'](), 0);
  }

  public setDays(days: number): void {
    this.isCustomRange = false;
    this.fromDays = days;

    const toDate = new Date();
    const fromDate = new Date().setDate(toDate.getDate() - days);

    this.filter = {
      startdate: this._dateFormat(fromDate),
      enddate: this._dateFormat(toDate)
    };

    this.load();
  }

  public setCustomRange(): void {
    this.isCustomRange = true;
    this.fromDays = 0;
  }

  public exportToCsv(): void {
    const history = this.awards
      .map(x => x._toJSON());
    console.log(history);

    const params = { useBom: false };
    const csv = new Angular2Csv(history, 'History', params);
  }

  public goCustomRange(): void {
    const pipe = new DatePipe('EN');
    this.filter.startdate = pipe.transform(this.customFrom, 'yyyy-MM-dd');
    this.filter.enddate = pipe.transform(this.customTo, 'yyyy-MM-dd');

    this.load();
  }

  private _dateFormat(date: Date | number): string {
    const pipe = new DatePipe('EN');
    return pipe.transform(date, 'yyyy-MM-dd');
  }
}
