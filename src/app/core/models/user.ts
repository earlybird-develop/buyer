import { Alias, Model } from 'tsmodels';

export class RegisteredEvent extends Model {
  @Alias() public label: string;
  @Alias('action_type') public actionType: string;
  @Alias('action_id') public actionId: string;
}

export class User extends Model {
  @Alias('user-id') public id: number;
  @Alias('user_email') public email: string;
  @Alias('contact_name') public contactName: string;
  @Alias('contact_phone') public contactPhone: string;
  @Alias('registered_time') public registeredTime: string;
  @Alias('registered_status') public registeredStatus: string;
  @Alias() public position: string;

  @Alias('registered_event', RegisteredEvent)

  public registeredEvent: RegisteredEvent;

  public hasRegisterEvent(): boolean {
    return !!this.registeredEvent;
  }
}
