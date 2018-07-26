import { Alias, Model } from 'tsmodels';

export class InvoicesFilter extends Model {
  @Alias('invoice_status') public invoiceStatus = 'eligible';
  @Alias('invoice_dpe') public dpe: number[] = [];
  @Alias('invoice_amount') public amount: number[] = [];
  @Alias('start_date') public startDate: string;
  @Alias('end_date') public endDate: string;

  public toggleDpe(value: number, elem: Event): void {
    if (elem.target['checked']) {
      this.dpe.push(value);
    } else {
      this.dpe.splice(this.dpe.indexOf(value), 1);
    }
  }

  public toggleAmount(value: number, elem: Event): void {
    if (elem.target['checked']) {
      this.amount.push(value);
    } else {
      this.amount.splice(this.amount.indexOf(value), 1);
    }
  }
}
