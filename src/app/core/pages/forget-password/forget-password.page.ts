import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'eb-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss']
})
export class ForgetPasswordPage implements OnInit {

  public showEmail: String = '';
  constructor(private router: Router,
    private _accountService: AccountService,
    private _toastr: ToastrService) { }

  ngOnInit() {
  }

  forgetPassword(forgetPasswordForm: NgForm): void {
    this._accountService
      .postForgetPasswordMail(forgetPasswordForm.value)
      .subscribe(
        () => this.showEmail = forgetPasswordForm.value.email,
        () => this._toastr.error('Invalid Email Error')
      );
  }

}
