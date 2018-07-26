import { Alias, Model } from 'tsmodels';
import { DatePipe } from '@angular/common';


export class Market extends Model {
  @Alias('market_id') public id: string;
  @Alias('active_status') public activeStatus: number;
  @Alias('average_apr') public averageApr: number;
  @Alias('average_dpe') public averageDpe: number;
  @Alias('market_cash') public cash: number;
  @Alias('cash_available') public cashAvailable: number;
  @Alias('cash_deployed') public cashDeployed: number;
  @Alias('cash_total') public cashTotal: number;
  @Alias('currency') public currency: string;
  @Alias('currency_sign') public currencySign: string;
  @Alias('expect_apr') public expectApr: number;
  @Alias('income') public income: number;
  @Alias('market_name') public name: string;
  @Alias('market_status') public status: number;
  @Alias('min_apr') public minApr: number;
  @Alias('paid_eligible') public paidEligible: number;
  @Alias('paid_total') public paidTotal: number;
  @Alias('paydate') public payDate: string;
  @Alias('reconcilation_date') public reconcilationDate: string;
  @Alias('reserve_percentage') public reservePercentage: number;

  public updateOrigin(market: Market): void {
    this.cashAvailable = market.cash;
    this.expectApr = market.expectApr;
    this.minApr = market.minApr;
    this.reservePercentage = market.reservePercentage;

    const pipe = new DatePipe('EN');
    this.payDate = pipe.transform(market.payDate, 'yyyy/MM/dd');
    this.reconcilationDate =
      pipe.transform(market.reconcilationDate, 'yyyy/MM/dd');
  }
}
