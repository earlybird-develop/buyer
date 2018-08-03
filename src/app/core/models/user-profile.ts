import { Alias, Model } from 'tsmodels';

export class UserProfile extends Model {
  @Alias('department_email') public departmentEmail: string;
  @Alias('profile') public id: string;
  @Alias() public email: string;
  @Alias() public name: string;
  @Alias() public lastname: string;
  @Alias() public job: string;
  @Alias() public phone: string;
  @Alias() public fiscalyear: string;
  @Alias() public industry: string;
  @Alias() public country: string;
}

export class ForegtPasswordEmail {
  public email: string;
}