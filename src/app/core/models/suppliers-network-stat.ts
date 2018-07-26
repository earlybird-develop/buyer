import { Alias, Model } from 'tsmodels';

class Counts extends Model {
  @Alias() public count: number;
  @Alias('count_ap') public countAp: number;
}

export class SuppliersNetworkStat extends Model {
  @Alias('total', Counts) public total: Counts;
  @Alias('registerd', Counts) public registered: Counts;
  @Alias('particpated', Counts) public participated: Counts;

  @Alias('top_by_ap') public topByAp: Object;
  @Alias('top_by_income') public topByIncome: Object;
}
