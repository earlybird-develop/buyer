import { Component, Input, OnInit } from '@angular/core';
import { Market } from '../../models';
import { MarketsService } from '../../services';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { listener } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'eb-market-setting',
  templateUrl: './market-setting.component.html',
  styleUrls: ['./market-setting.component.scss']
})
export class MarketSettingComponent implements OnInit {
  public market: Market;
  public marketClone: Market;
  public editMode = false;

  public marketSchedule = new Market();

  @Input() public marketOrig: Market;
  @Input() public popoverHandler: any;

  constructor(private _marketsService: MarketsService,
    private _toastr: ToastrService) { }

  ngOnInit() {

    this.scheduleEvents('add', null, 'init');
    this.getSettings();
  }

  getSettings() {
    this._marketsService
      .getSettings(this.marketOrig.id)
      .subscribe(
        market => this.market = market,
        () => this._toastr.error('Internal server error')
      );

    // this.marketSchedule.schedulesList = [{ "allocate_id": 1, "status": 2, "paydate": '2018/08/20', "cashamount": "20000" },
    // { "allocate_id": 2, "status": 1, "paydate": '2018/08/21', "cashamount": "30000" },
    // { "allocate_id": 3, "status": 3, "paydate": '2018/08/22', "cashamount": "40000" }];
  }

  public close(): void {
    this._marketsService.popoverClose.emit();
  }

  public enableEditMode(): void {
    this.marketClone = Object.assign({}, this.market);
    this.editMode = true;
  }

  public cancelEditing(): void {
    this.market = Object.assign({}, this.marketClone);
    this.editMode = false;
  }

  public save(): void {
    const pipe = new DatePipe('EN');
    this.market.payDate = pipe.transform(this.market.payDate, 'yyyy/MM/dd');
    this._marketsService
      .setSettings(this.market)
      .subscribe(
        () => {
          this.marketOrig.updateOrigin(this.market);
          this.marketClone = null;
          this.editMode = false;

          this._toastr.success('Market data successfully saved');
        },
        errors => this._toastr.warning('Error while saving', errors['data'])
      );

      this.saveSchedule();
  }

  public saveSchedule(): void {
    this.marketSchedule.schedulesList.forEach((list: any, index) => {
      const pipe = new DatePipe('EN');
      let dates = pipe.transform(list.paydate, 'yyyy/MM/dd');
      return list.paydate = dates;
    });

    let schedules = { allocates: [] };
    schedules.allocates = this.marketSchedule.schedulesList;
    this._marketsService
      .allocateSchedules(schedules, this.marketOrig.id)
      .subscribe(
        resp => this.market = resp,
        () => this._toastr.warning('Error while saving')
      )

  }

  public scheduleEvents(clickEvent: string, index: number, init) {
    this.marketSchedule.allocateScheduleList(clickEvent, index, null)
  }

  public removeEvents(clickEvent: string, index: number, schedule: any) {
    if (schedule.allocate_id === 0) {
      this.marketSchedule.allocateScheduleList(clickEvent, index, null)
    } else {
      let data = { allocate_id: schedule.allocate_id };
      this._marketsService
        .removeSchedules(data, this.marketOrig.id)
        .subscribe(
          resp => this.marketSchedule.allocateScheduleList(clickEvent, index, null),
          () => this._toastr.warning('Error while removing')
        )
      this.getSettings();
    }
  }
}
