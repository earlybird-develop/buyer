import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { CheckboxComponent } from './checkbox/checkbox.component';
import { TimerComponent } from './timer/timer.component';
import { FooterComponent } from './footer/footer.component';

import { TimerService } from './timer/timer.service';
import {
  SidebarablePageComponent
} from './sidebarable-page/sidebarable-page.component';

import { InlineEditComponent } from './inline-edit/inline-edit.component';

import {
  SearchFilterPipe,
  CapitalizePipe,
  KeysPipe
} from './pipes';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DialogService, DialogComponent } from './dialog';
import { CustomSelectComponent } from './custom-select/custom-select.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    PerfectScrollbarModule
  ],
  declarations: [
    CheckboxComponent,
    TimerComponent,
    SidebarablePageComponent,
    InlineEditComponent,
    FooterComponent,
    DialogComponent,

    SearchFilterPipe,
    CapitalizePipe,
    KeysPipe,
    CustomSelectComponent
  ],
  providers: [
    TimerService,
    DialogService
  ],
  exports: [
    CheckboxComponent,
    TimerComponent,
    SidebarablePageComponent,
    InlineEditComponent,
    FooterComponent,
    CustomSelectComponent,

    SearchFilterPipe,
    CapitalizePipe,
    KeysPipe
  ],
  entryComponents: [
    DialogComponent
  ]
})
export class SharedModule { }
