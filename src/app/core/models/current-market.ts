import { Alias, Model } from 'tsmodels';

export class Amount extends Model {
  @Alias('available_amount') public availableAmount: number;
  @Alias('discount_amount') public discountAmount: number;
  @Alias('average_dpe') public averageDpe: number;
  @Alias('average_apr') public averageApr: number;
}

export class CurrentMarket extends Model {
  @Alias() public currency: string;
  @Alias('currency_sign') public currencySign: string;
  @Alias('market_status') public marketStatus: number;
  @Alias('total', Amount) public total: Amount;
  @Alias('clearing', Amount) public clearing: Amount;
  @Alias('nonclearing', Amount) public non: Amount;
}
