import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { PopoverDirective } from 'ngx-bootstrap';

import { MarketsService } from '../../services';
import { Market } from '../../models';


@Component({
  selector: 'eb-markets',
  templateUrl: './markets.page.html',
  styleUrls: ['./markets.page.scss']
})
export class MarketsPage implements OnInit {
  public participation = 'all_on';
  public currentMarket: Market;
  public markets: Market[];

  @ViewChildren(PopoverDirective)
  public popovers: QueryList<PopoverDirective>;

  constructor(private _marketsService: MarketsService,
              private _toastr: ToastrService) { }

  ngOnInit() {
    this._marketsService
      .getList()
      .subscribe(
        markets => this.markets = markets,

        () => this._toastr.error('Internal server error')
      );

    // Hack : I'm sorry
    // It is closing popup, which closed on its own
    this._marketsService
      .popoverClose
      .subscribe(
        () => this.popovers.find(x => x.isOpen).hide()
      );
  }

  public openSettings(market: Market): void {
    const pop = this.popovers.find(x => x.isOpen);

    if (pop) {
      pop.hide();
    }
    
    this.currentMarket = market;
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
