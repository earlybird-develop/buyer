import { Component, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from './shared/dialog';


@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  constructor(vRef: ViewContainerRef,
              dialog: DialogService,
              translate: TranslateService) {
     dialog.setRootViewContainerRef(vRef);
     translate.setDefaultLang('cn');
     translate.use(localStorage.getItem('lang') || 'cn');
  }
}
