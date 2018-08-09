import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CoreRoutingModule } from './core-routing.module';

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ChartsModule } from 'ng2-charts';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SharedModule } from '../shared/shared.module';

import {
  MarketsService,
  SuppliersService,
  InvoicesService,
  MarketHistoryService,
  CurrentMarketService,
  SubheaderService,
  AccountService
} from './services';

import {
  WrapperPage,
  MarketPage,
  MarketsPage,
  MarketHistoryPage,
  MarketCurrentPage,
  MarketSupplierManagePage,
  MarketInvoicesManagePage,
  AccountPage,
  ChangePasswordPage,
  ProfilePage,
  SigninPage,
  ForgetPasswordPage
} from './pages';

import {
  MarketHeaderComponent,
  MarketSettingComponent,
  HeaderComponent
} from './components';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule,
    NoopAnimationsModule,
    CoreRoutingModule,
    ChartsModule,
    TranslateModule,
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    ToastrModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [
    MarketsService,
    InvoicesService,
    MarketHistoryService,
    CurrentMarketService,
    SuppliersService,
    SubheaderService,
    AccountService
  ],
  declarations: [
    WrapperPage,
    MarketsPage,
    MarketSettingComponent,
    MarketHeaderComponent,
    HeaderComponent,
    MarketPage,
    MarketSupplierManagePage,
    MarketInvoicesManagePage,
    MarketHistoryPage,
    MarketCurrentPage,
    AccountPage,
    ChangePasswordPage,
    ProfilePage,
    SigninPage,
    ForgetPasswordPage
  ],
  entryComponents: [
    MarketHeaderComponent,
    MarketSettingComponent
  ]
})
export class CoreModule { }
