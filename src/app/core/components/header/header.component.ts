import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { SubheaderService } from '../../services';


const GET_PROFILE_PATH = '/account/get_profile';

@Component({
  selector: 'eb-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  @ViewChild('subheader', { read: ViewContainerRef })
  private _subheaderContainer: ViewContainerRef;
  public login_name: string;
  constructor(private _subHeader: SubheaderService,
              private _router: Router,
              private _http: HttpClient,
              public translate: TranslateService) {}

  ngOnInit() {

    this._http
      .get(GET_PROFILE_PATH)
      .subscribe(
        resp => {
          this.login_name = resp['data']['name'];
        },
        errors => {
          this.login_name = "Error";
        }
      );

    this._subHeader.setRootViewContainerRef(this._subheaderContainer);
  }

  public selectLang(lang: string): void {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
  }

  public logout() {

    localStorage.removeItem('access_token');
    localStorage.removeItem('expire_time');
    localStorage.removeItem('openid');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_name');
    this._router.navigate(['/signin']);

  }
}
