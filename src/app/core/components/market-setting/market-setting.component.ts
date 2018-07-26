import { Component, Input, OnInit } from '@angular/core';
import { Market } from '../../models';
import { MarketsService } from '../../services';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'eb-market-setting',
  templateUrl: './market-setting.component.html',
  styleUrls: ['./market-setting.component.scss']
})
export class MarketSettingComponent implements OnInit {
  public market: Market;
  public marketClone: Market;
  public editMode = false;

  @Input() public marketOrig: Market;
  @Input() public popoverHandler: any;

  constructor(private _marketsService: MarketsService,
              private _toastr: ToastrService) { }

  ngOnInit() {
    this._marketsService
      .getSettings(this.marketOrig.id)
      .subscribe(
        market => this.market = market,
        () => this._toastr.error('Internal server error')
      );
  }

  public close(): void {
    this._marketsService.popoverClose.emit();
  }

  public enableEditMode(): void {
    this.marketClone = Object.assign({}, this.market);
    this.editMode = true;
  }

  public cancelEditing(): void {
    this.market = Object.assign({}, this.marketClone);
    this.editMode = false;
  }

  public save(): void {

    const pipe = new DatePipe('EN');
    this.market.payDate = pipe.transform(this.market.payDate, 'yyyy/MM/dd');

    this._marketsService
      .setSettings(this.market)
      .subscribe(
        () => {
          this.marketOrig.updateOrigin(this.market);
          this.marketClone = null;
          this.editMode = false;

          this._toastr.success('Market data successfully saved');
        },
        errors => this._toastr.warning('Error while saving', errors['data'])
      );
  }
}
