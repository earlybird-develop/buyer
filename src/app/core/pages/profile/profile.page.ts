import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services';

import { ToastrService } from 'ngx-toastr';

import { UserProfile } from '../../models';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'eb-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {

  public user: UserProfile;

  constructor(private _accountService: AccountService,
              private _toastr: ToastrService) { }

  ngOnInit() {
    this._accountService
      .getProfile()
      .subscribe(x => this.user = x);
  }

  public saveProfile(form: NgForm): void {
    this._accountService
      .updateProfile(this.user)
      .subscribe(() => this._toastr.success('Profile saved!'));
  }
}
