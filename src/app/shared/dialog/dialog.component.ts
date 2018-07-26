import {
  Component, OnDestroy, OnInit, Renderer2, HostListener, Inject
} from '@angular/core';

import { DOCUMENT } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


@Component({
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit, OnDestroy {
  private _onExit: Subject<boolean> = new Subject();
  public type = 'alert';
  public text: string;

  @HostListener('document:keydown.esc')
  public onEsc(): void {
    this.cancel();
  }

  constructor(@Inject(DOCUMENT) private _document: Document,
              private renderer: Renderer2) {
  }

  ngOnInit() {
    this.renderer.addClass(this._document.body, 'dialog-open');
  }

  ngOnDestroy() {
    this.renderer.removeClass(this._document.body, 'dialog-open');
  }

  public submit(): void {
    this._onExit.next(true);
    this._onExit.complete();
  }

  public cancel(): void {
    this._onExit.error(false);
    this._onExit.complete();
  }

  public onExit(): Observable<boolean> {
    return this._onExit.asObservable();
  }
}
