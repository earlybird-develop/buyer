import { Alias, Model } from 'tsmodels';
import { User } from './user';


export class Supplier extends Model {
  @Alias('supplier_id') public id: string;
  @Alias('supplier_status') public status: number;
  @Alias('supplier_name') public name: string;
  @Alias('vendor_code') public vendorCode: string;
  @Alias('supplier_users') public usersCount: number;

  public users: User[] = [];
  public _showDetails = false;

  public clearUsers(): void {
    this.users = [];
  }

  public hasUserRegisterEvent(): boolean {
    return !!this.users.find(x => !!x.registeredEvent);
  }
}
