import {
  Component, OnInit, OnDestroy, Inject, Renderer2
} from '@angular/core';

import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'eb-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss']
})
export class AccountPage implements OnInit, OnDestroy {

  constructor(@Inject(DOCUMENT) private _document: Document,
              private _renderer: Renderer2) { }

  ngOnInit() {
    this._renderer.addClass(this._document.body, 'grey');
  }

  ngOnDestroy() {
    this._renderer.removeClass(this._document.body, 'grey');
  }
}
