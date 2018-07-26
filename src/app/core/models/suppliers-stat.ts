import { Alias, Model } from 'tsmodels';

export class SuppliersStat extends Model {
  @Alias('participated_ap_count') public participatedApCount: number;
  @Alias('participated_count') public participatedCount: number;
  @Alias('registered_ap_count') public registeredApCount: number;
  @Alias('registered_count') public registeredCount: number;
  @Alias('total_ap_count') public totalApCount: number;
  @Alias('total_count') public totalCount: number;
}
