import { Alias, Model } from 'tsmodels';

export class Award extends Model {
  @Alias('average_apr') public averageApr: number;
  @Alias('average_discount') public averageDiscount: number;
  @Alias('average_dpe') public averageDpe: number;
  @Alias('award_id') public id: string;
  @Alias('award_date') public awardDate: string;
  @Alias('discount_amount') public discountAmount: number;
  @Alias('invoice_amount') public invoiceAmount: number;
  @Alias('invoice_count') public invoiceCount: number;
  @Alias('paid_amount') public paidAmount: number;

  constructor(data?) {
    super();

    if (data) {
      this._fromJSON(data);
    }
  }
}

