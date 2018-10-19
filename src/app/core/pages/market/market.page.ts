import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MarketHeaderComponent } from '../../components';
import { SubheaderService } from '../../services';

import { MarketsService, CurrentMarketService } from '../../services';
import { Market } from '../../models';

@Component({
  selector: 'eb-market',
  templateUrl: './market.page.html'
})
export class MarketPage implements OnInit, OnDestroy {

    public buyId: string;
    public market: Market = new Market();

  constructor(private _subheader: SubheaderService,
      private _route: ActivatedRoute,
      public marketsService: MarketsService,
      public currentMarketsService: CurrentMarketService) { }

  ngOnInit() {
    this.buyId = this._route.snapshot.params.id;

    const subhHeader = this._subheader.show(MarketHeaderComponent);
    subhHeader.buyId = this.buyId;

    this.marketsService
        .getSettings(this.buyId)
        .subscribe(
        market => {
            subhHeader.payDate = market.payDate;
            subhHeader.buyerName = market.name;
        },
        errors => console.error(errors)
        );
  }

  ngOnDestroy() {
    this._subheader.dispose();
  }
}
