import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CurrentMarketService, MarketsService } from '../../services';

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

  // 页面重新读取数据时间
  private refresh_time = 5000;
  private _interval: any;

  private refresh_data = false;

  private current_hash = [];

  private _code: string;

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
            max: 250000,
            fontSize: 18,
            callback: function (dataLabel, index) {
              let dataValue = dataLabel / 1000;
              return dataLabel % 50000 === 0 ? (dataValue === 0 ? 0 : dataValue + 'k') : '';
            }
          },
          gridLines: {
              drawOnChartArea: false
          }
        },
        {
          id: 'yAxis2',
          position: 'right',
          ticks: {
            min: 0,
            max: 45,
            fontSize: 18,
            callback: function (dataLabel, index) {
              return dataLabel % 5 === 0 ? (dataLabel === 0 ? 0 : dataLabel + '%') : '';
            }
          },
          gridLines: {
              drawOnChartArea: false
          }
        }
      ]
    }
  };

  constructor(private _currentMarketService: CurrentMarketService,
    private _route: ActivatedRoute,
    private _toastr: ToastrService,
    private _marketsService: MarketsService) {
    this._marketId = this._route.parent.snapshot.params.id;
  }

  ngOnInit() {

    this.load_hash();
    this.load_getMarketGraph();
    this.load_currentMarket();
    this.load_getMarketStat();
    this.load_getSupplierNetworkStat();

    this._interval = setInterval(
      () => {
        // this.load();
        this.load_hash();

        if (this.refresh_data) {
          this.load_currentMarket();
          this.load_getMarketGraph();
          this.load_getMarketStat();
          this.load_getSupplierNetworkStat();
        }
        // console.log('1');
      }
      , this.refresh_time
    );
  }

  // 获取hash值
  load_hash() {
    this._marketsService
      .getHashList([this._marketId])
      .subscribe(
        resp => {
          if (resp.code === 1) {

            // tslint:disable-next-line:max-line-length
            /*if (resp.data.length !== this.current_hash.length && this.current_hash.length > 0) {
              this.current_hash = [];
            }*/

            for (const hash of resp.data) {

              this._code = hash['cashpool_code'];

              if (this.current_hash.includes(this._code)) {  // 判断当前页面是否有该市场键
                if (this.current_hash[this._code] !== hash['stat_hash']) {
                  this.current_hash[this._code] = hash['stat_hash'];
                  if (!this.refresh_data) {
                    this.refresh_data = true;
                  }
                }
              } else {
                this.current_hash.push(this._code);
                this.current_hash[this._code] = hash['stat_hash'];

                if (!this.refresh_data) {
                  this.refresh_data = true;
                }
              }
            }
          } else {
            this._toastr.warning(resp.msg);
          }

        }
        , error => {
          this._toastr.error('Internal server error');
        }
      );
  }

  // 获取当前市场
  load_currentMarket() {
    this._currentMarketService
      .getMarket(this._marketId)
      .subscribe(
        res => this.currentMarket = res,
        () => this._toastr.error('Internal server error')
      );
  }

  load_getMarketGraph() {
    this._currentMarketService
      .getMarketGraph(this._marketId)
      .subscribe(
        x => this.chartHandler(x),
        () => this._toastr.error('Internal server error')
      );
  }

  load_getMarketStat() {
    this._currentMarketService
      .getMarketStat(this._marketId)
      .subscribe(
        res => this.currentMarketStat = res,
        () => this._toastr.error('Internal server error')
      );
  }

  load_getSupplierNetworkStat() {
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
