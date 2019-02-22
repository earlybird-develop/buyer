import { Alias, Model } from 'tsmodels';

export class Saler extends Model {
  @Alias('market_id') public id: string;
  @Alias('paydate') public payDate: string;
  @Alias('currency') public currency: string;
  @Alias('currency_sign') public currencySign: string;
}
