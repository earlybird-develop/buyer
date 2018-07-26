import { Alias, Model } from 'tsmodels';

export class MarketStat extends Model {
  @Alias() public currency: string;
  @Alias('available_amount') public availableAmount: number;
  @Alias('invoice_count') public invoiceCount: number;
  @Alias('suppliers_count') public suppliersCount: number;
}
