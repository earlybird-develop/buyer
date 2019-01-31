import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MarketsService } from '../../services';
import { Market, Saler } from '../../models';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MarketSettingComponent } from '../../components/market-setting/market-setting.component';

@Component({
  selector: 'eb-markets',
  templateUrl: './markets.page.html',
  styleUrls: ['./markets.page.scss']
})
export class MarketsPage implements OnInit {
  public participation = 'all_on';
  public currentMarket: Market;
  public salers: Saler[];
  public markets: Market[];
  public bsModalRef: BsModalRef;
  private _interval: any;
  private refresh_time = 5000;  // 页面重新读取数据时间
  private refresh_data = false;
  private current_hash = [];
  private _code: string;
  constructor(private _marketsService: MarketsService,
    private _toastr: ToastrService,
    private modalService: BsModalService) { }
  ngOnInit() {

    this.load_hash();
    this.load_data();
    this._interval = setInterval(
      () => {
        // this.load();
        this.load_hash();
        if (this.refresh_data) {
          this.load_data();
        }
        // console.log('1');
      }, this.refresh_time
    );
    // Hack : I'm sorry
    // It is closing popup, which closed on its own
    // this._marketsService
    //   .popoverClose
    //   .subscribe(
    //     () => this.popovers.find(x => x.isOpen).hide()
    //   );
  }

  load_hash() {
    this._marketsService
      .getHashList([])
      .subscribe(
        resp => {
          if (resp.code === 1) {
            if (resp.data.length !== this.current_hash.length && this.current_hash.length > 0) {
              this.current_hash = [];
            }
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

  load_data() {
    this._marketsService
      .getList()
      .subscribe(
        markets => {
          this.markets = markets;
        },
        error => {
          this._toastr.error('Internal server error');
        }
      );

    this.refresh_data = false;
  }
  ngOnDestroy() {
    clearInterval(this._interval);
  }

  openModalWithComponent() {
    const initialState = {
      marketOrig: this.currentMarket
    };
    this.bsModalRef = this.modalService.show(MarketSettingComponent, Object.assign({ class:'market-setting',initialState }, { class: 'setting-modal' }));
  }

  call() { }

  public openSettings(market: Market): void {
    // const pop = this.popovers.find(x => x.isOpen);
    // if (pop) {
    //   pop.hide();
    // }
    this.currentMarket = market;
    this.openModalWithComponent();
  }

  public setMarketStatus(status: boolean, market: Market): void {
    this._marketsService
      .setMarketActive(market.id, status)
      .subscribe(
        success => {
          if (success['code'] === 1) {
            market.status = status ? 1 : -1;
            this._toastr.success('Market data successfully saved');
          } else {
            this._toastr.warning(success['msg']);
          }
        },
        error => this._toastr.error(error['statusText'])
      );
  }
}
