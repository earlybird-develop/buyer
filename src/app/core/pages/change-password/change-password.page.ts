import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'eb-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss']
})
export class ChangePasswordPage {

  constructor(private _toastr: ToastrService) { }

  public changePassword(): void {
    this._toastr.error('Api isn\'t working');
  }
}
