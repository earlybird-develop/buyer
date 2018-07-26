import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AccountService } from '../../services';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'eb-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss']
})
export class SigninPage {

  constructor(private router: Router,
              private _accountService: AccountService,
              private _toastr: ToastrService) { }

  public login(form: NgForm): void {
    this._accountService
      .getAccessToken(form.value)
      .subscribe(
        () => this.router.navigate(['/']),
        () => this._toastr.error('Login error')
      );
  }



}
