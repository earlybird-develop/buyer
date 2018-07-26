import { Component, OnInit } from '@angular/core';

import { TimerService } from './timer.service';

@Component({
  selector: 'eb-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  private _value = 0;

  public seconds = 0;
  public minutes = 0;
  public hours = 0;

  constructor(private _timer: TimerService) { }

  ngOnInit() {
    this._timer
      .onCloseTimeChange
      .subscribe(x => {
        const value = x - Math.floor(+new Date() / 1000);

        if (x < 0 || value < 0) {
          return;
        }

        this._value = value;

        setInterval(() => this._convertTimer(), 1000);
      });
  }

  private _convertTimer(): void {
    this._value--;
    this.hours = Math.floor(this._value / 3600);
    this.minutes = Math.floor((this._value - this.hours * 3600) / 60);
    this.seconds = this._value - this.minutes * 60 - this.hours * 3600;
  }
}
