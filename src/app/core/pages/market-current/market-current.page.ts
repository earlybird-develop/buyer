import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CurrentMarketService } from '../../services';

import {
  CurrentMarket,
  CurrentMarketStat,
  SuppliersNetworkStat
} from '../../models';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'eb-market-current',
  templateUrl: './market-current.page.html',
  styleUrls: ['./market-current.page.scss']
})
export class MarketCurrentPage implements OnInit {

  private _marketId: string;

  public graphData: Object[] = [];

  public currentMarket: CurrentMarket;
  public currentMarketStat: CurrentMarketStat;
  public supplierNetworkStat: SuppliersNetworkStat;

  // Chart configuration
  public barChartType = 'bar';
  public barChartLabels: string[] = [];
  public barChartData: any[] = [{}, {}];
  public barChartOptions: any = {
    responsive: true,
    legend: false,
    scales: {
      xAxes: [{
        barPercentage: 1.0,
        ticks: {
          fontSize: 18,
          callback: value => value >= 1000 ? value / 1000 + 'K' : value
        },
        gridLines: {
          drawOnChartArea: false
        }
      }],
      yAxes: [
        {
          id: 'yAxis1',
          position: 'left',
          ticks: {
            min: 0,
            fontSize: 18,
            callback: value => value >= 1000 ? value / 1000 + 'K' : value
          }
        },
        {
          id: 'yAxis2',
          position: 'right',
          ticks: {
            min: 0,
            fontSize: 18,
            callback: value => value ? value + '%' : value
          }
        }
      ]
    }
  };

  constructor(private _currentMarketService: CurrentMarketService,
    private _route: ActivatedRoute,
    private _toastr: ToastrService) {
    this._marketId = this._route.parent.snapshot.params.id;
  }

  ngOnInit() {

    this._currentMarketService
      .getMarketGraph(this._marketId)
      .subscribe(
        x => this.chartHandler(x),
        () => this._toastr.error('Internal server error')
      );

    this._currentMarketService
      .getMarket(this._marketId)
      .subscribe(
        res => this.currentMarket = res,
        () => this._toastr.error('Internal server error')
      );


    this._currentMarketService
      .getMarketStat(this._marketId)
      .subscribe(
        res => this.currentMarketStat = res,
        () => this._toastr.error('Internal server error')
      );

    this._currentMarketService
      .getSupplierNetworkStat(this._marketId)
      .subscribe(
        x => this.supplierNetworkStat = x,
        () => this._toastr.error('Internal server error')
      );
  }

  public calculatePersentage(val1: number, val2: number): string {
    return val2 / val1 * 100 + '%';
  }

  public chartHandler(data: Object[]): void {
    this.graphData = data;
    this.barChartLabels = this.graphData.map(x => x['date']);

    this.barChartData.push(
      {
        data: this.graphData.map(x => x['discount_amount']),
        label: 'Income',
        yAxisID: 'yAxis1',
        backgroundColor: '#4c73c8'
      });

    this.barChartData.push({
      data: this.graphData.map(x => x['average_apr']),
      label: 'APR',
      yAxisID: 'yAxis2',
      hoverBackgroundColor: '#e6f0ff',
      type: 'line',
      borderColor: '#000'
    });
  }
}
