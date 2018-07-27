import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../services';

@Component({
  selector: 'eb-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss']
})
export class ChangePasswordPage {

  constructor(private _toastr: ToastrService,
              private _accountService: AccountService) {

  }

  public changePassword(): void {
    this._accountService
      .changePassword()
      .subscribe(() => this._toastr.success('Reset Password Email had seen!'));

  }
}
