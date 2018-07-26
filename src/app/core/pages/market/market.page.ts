import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MarketHeaderComponent } from '../../components';
import { SubheaderService } from '../../services';

@Component({
  selector: 'eb-market',
  templateUrl: './market.page.html'
})
export class MarketPage implements OnInit, OnDestroy {

  public buyId: string;

  constructor(private _subheader: SubheaderService,
              private _route: ActivatedRoute) { }

  ngOnInit() {
    this.buyId = this._route.snapshot.params.id;

    const subhHeader = this._subheader.show(MarketHeaderComponent);
    subhHeader.buyId = this.buyId;
  }

  ngOnDestroy() {
    this._subheader.dispose();
  }
}
