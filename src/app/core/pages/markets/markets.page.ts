import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
// import { PopoverDirective } from 'ngx-bootstrap';

import { MarketsService } from '../../services';
import { Market } from '../../models';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {MarketSettingComponent} from '../../components/market-setting/market-setting.component';

@Component({
  selector: 'eb-markets',
  templateUrl: './markets.page.html',
  styleUrls: ['./markets.page.scss']
})
export class MarketsPage implements OnInit {
  public participation = 'all_on';
  public currentMarket: Market;
  public markets: Market[];
  public bsModalRef: BsModalRef;
  // @ViewChildren(PopoverDirective)
  // public popovers: QueryList<PopoverDirective>;

  constructor(private _marketsService: MarketsService,
              private _toastr: ToastrService, private modalService: BsModalService) { }

  ngOnInit() {
    this._marketsService
      .getList()
      .subscribe(
        markets => this.markets = markets,

        () => this._toastr.error('Internal server error')
      );

    // Hack : I'm sorry
    // It is closing popup, which closed on its own
    // this._marketsService
    //   .popoverClose
    //   .subscribe(
    //     () => this.popovers.find(x => x.isOpen).hide()
    //   );
  }

  openModalWithComponent() {
    const initialState = {
      marketOrig: this.currentMarket,
      title: 'Modal with component'
    };
    this.bsModalRef = this.modalService.show(MarketSettingComponent, Object.assign({initialState}, { class: 'setting-modal' }));
    this.bsModalRef.content.closeBtnName = 'Close';
  }

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
        () => {
          market.status = status ? 1 : -1;
          this._toastr.success('Market data successfully saved');
        },
        () => null
      );
  }
}
