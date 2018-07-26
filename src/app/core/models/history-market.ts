import { Alias, Model } from 'tsmodels';

export class HistoryMarket extends Model {
  @Alias('average_discount') public averageDiscount: number;
  @Alias('awarded_amount') public awardedAmount: number;
  @Alias('discount_amount') public discountAmount: number;
  @Alias() public currency: string;

  constructor(data?) {
    super();

    if (data) {
      this._fromJSON(data);
    }
  }
}
