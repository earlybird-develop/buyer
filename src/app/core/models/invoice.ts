import { Alias, Model } from 'tsmodels';

export class Invoice extends Model {
  @Alias('inv_id') public invId: string;
  @Alias('invoice_status') public invoiceStatus: string;
  @Alias('vendor_code') public vendorCode: string;
  @Alias('supplier_name') public supplierName: string;
  @Alias('invoice_no') public invoiceId: string;
  @Alias('original_paydate') public originalPaydate: string;
  @Alias('invoice_amount') public invoiceAmount: number;

  public _checked = false;
}
