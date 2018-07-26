import { Alias, Model } from 'tsmodels';

class Amount extends Model {
  @Alias('available_amount') public availableAmount: number;
  @Alias('supplier_count') public supplierCount: number;
  @Alias('invoice_count') public invoiceCount: number;
}

class Discount extends Model {
  @Alias('discount_amount') public discountAmount: number;
  @Alias('average_dpe') public averageDpe: number;
  @Alias('average_apr') public averageApr: number;
}

class DiscountGroup extends Model {
  @Alias('total', Discount) public total: Discount;
  @Alias('manual', Discount) public manual: Discount;
  @Alias('clearing', Discount) public clearing: Discount;
}

class AmountGroup extends Model {
  @Alias('current', Amount) public current: Amount;
  @Alias('pending', Amount) public pending: Amount;
  @Alias('total', Amount) public total: Amount;
}

export class CurrentMarketStat extends Model {
  @Alias('discount', DiscountGroup) public discount: DiscountGroup;
  @Alias('available_amount', AmountGroup) public amount: AmountGroup;
}

// data:{
//   'currency': 'USD',
//     'currency_sign': '$',
//     'discount' : {
//     'total': {
//       'discount_amount' : 980.34,
//         'average_dpe': 31,
//         'average_apr': 7.9
//     },
//     'manual': {
//       'discount_amount' : 0,
//         'average_dpe': 0,
//         'average_apr': 0
//     },
//     'clearing': {
//       'discount_amount' : 980.34,
//         'average_dpe': 31,
//         'average_apr': 7.9
//     }
//   },
//   'available_amount' : {
//     'current':{
//       'available_amount' : 17800.1,
//         'supplier_count' : 1,
//         'invoice_count' : 2
//     }
//     'pending':{
//       'available_amount' : 10127.1,
//         'supplier_count' : 1,
//         'invoice_count' : 2
//     }
//     'total':{
//       'available_amount' : 27927.2,
//         'supplier_count' : 2,
//         'invoice_count' : 4
//     }
//   }
// }
