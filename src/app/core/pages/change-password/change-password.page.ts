import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../services';
import { UserProfile, User } from '../../models';

@Component({
  selector: 'eb-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss']
})
export class ChangePasswordPage implements OnInit{

  public user: UserProfile;

  constructor(private _toastr: ToastrService,
              private _accountService: AccountService) {

  }

  ngOnInit() {
    this._accountService
      .getProfile()
      .subscribe(x => this.user = x);
  }

  public changePassword(): void {
    // this._accountService
    //   .changePassword()
    //   .subscribe(() => this._toastr.success('Reset Password Email had seen!'));

  }
}
