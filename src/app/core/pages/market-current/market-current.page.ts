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
  public barChartData: Object[];
  public barChartOptions: any = {
    responsive: true,
    legend: false,
    scales: {
      xAxes: [{
        barPercentage: 0.4,
        gridLines: {
          drawOnChartArea: false
        }
      }],
      yAxes: [{
        position: 'left',
        ticks: {
          fontSize: 9,
          callback: value => value >= 1000 ? value / 1000 + 'K' : value
        }
      }
      // {
      //   position: 'left',
      //   ticks: {
      //     fontSize: 9,
      //     beginAtZero: true,
      //     fontColor: '43425D'
      //   }
      // }
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
    return val1 / val2 * 100 + '%';
  }

  public chartHandler(data: Object[]): void {
    this.graphData = data;
    this.barChartLabels = this.graphData.map(x => x['date']);

    this.barChartData = [
      {
        data: this.graphData.map(x => x['average_apr']),
        // label: 'APR',
        hoverBackgroundColor: '#e6f0ff',
        type: 'line',
        borderColor: '#000'
      },
      {
        data: this.graphData.map(x => x['discount_amount']),
        // label: 'Income',
        hoverBackgroundColor: '#4f7dc9'
      }
    ];
  }
}
