import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';

@Injectable()
export class TimerService {
  public onCloseTimeChange = new Subject<number>();

  public setCloseTime(timestamp: number): void {
    this.onCloseTimeChange.next(timestamp);
  }
}
