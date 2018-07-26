import { ComponentFactoryResolver, Injectable } from '@angular/core';

import { ComponentBase } from './component-base';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { DialogComponent } from './dialog.component';

@Injectable()
export class DialogService extends ComponentBase {

  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    super(componentFactoryResolver);
  }

  public show(type: string, text: string): Observable<boolean> {
    super._show(DialogComponent, []);

    return Observable.create((observer: Observer<boolean>) => {

      this.container.instance.text = text;
      this.container.instance.type = type;

      this.container
        .instance
        .onExit()
        .subscribe(
          res => { observer.next(res); this.dispose(); observer.complete(); },
          res => { observer.error(res); this.dispose(); }
        );
    });
  }

  public alert(text: string): Observable<boolean> {
    return this.show('alert', text);
  }

  public confirm(text: string): Observable<boolean> {
    return this.show('confirm', text);
  }
}
