import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { AccessTokenInterceptor } from './access-token.interceptor';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

declare function require(name: string);
const enLocale = require('../locales/en.json');
const cnLocale = require('../locales/cn.json');
const twLocale = require('../locales/tw.json');

@Injectable()
export class CustomTranslateLoader extends TranslateLoader {
  public getTranslation(lang: string): Observable<Object> {
      if ( lang === 'cn' ) {
        const locale = cnLocale;
        return Observable.of(locale);
      } else if (lang === 'tw') {
        const locale = twLocale;
        return Observable.of(locale);
      } else if (lang === 'en') {
        const locale = enLocale;
        return Observable.of(locale);
      }
  }
}

export function HttpLoaderFactory() {
  return new CustomTranslateLoader();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: []
      }
    }),
    CoreModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AccessTokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

