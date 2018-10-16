import { Component, Input, OnInit } from '@angular/core';
import { Market } from '../../models';
import { MarketsService } from '../../services';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { listener } from '@angular/core/src/render3/instructions';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'eb-market-setting',
  templateUrl: './market-setting.component.html',
  styleUrls: ['./market-setting.component.scss']
})
export class MarketSettingComponent implements OnInit {
  public market: Market;
  public marketClone: Market;
  public editMode = false;
  public editCashMode = false;

  public marketSettings: any = {};
  public marketAllocates: any;

  public marketSchedule = new Market();

  @Input() public marketOrig: Market;
  @Input() public popoverHandler: any;

  constructor(private _marketsService: MarketsService,
    private _toastr: ToastrService,
    public bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.getSettings();
  }

  getSettings() {
    this._marketsService
      .getSettings(this.marketOrig.id)
      .subscribe(
        (market: any) => {
          this.market = this.marketSchedule = market;
          this.marketSettings = {
            expect_apr: market.expectApr,
            min_apr: market.minApr,
            reserve_percentage: market.reservePercentage,
            reconcilation_date: market.reconcilationDate
          };
          let data = market.schedulesList;
          this.marketAllocates = JSON.parse(JSON.stringify(data));
          market.schedulesList.length > 0 ? '' : this.scheduleEvents('add', null, 'init');
        },
        () => this._toastr.error('Internal server error')
      );
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

  public enableEditCashMode(): void {
    this.marketClone = Object.assign({}, this.market);
    this.editCashMode = true;
  }

  public cancelEditCashMode(): void {
    this.market = Object.assign({}, this.marketClone);
    this.editCashMode = false;
  }

  public saveCash(): void{
    let marketScheduleAllocates = this.market.schedulesList;
    let checkMarketSchedule = JSON.stringify(this.marketAllocates) == JSON.stringify(marketScheduleAllocates)
    if (!checkMarketSchedule) {
      this.saveSchedule();
    }
  }

  public save(): void {
    const pipe = new DatePipe('EN');
    this.market.payDate = pipe.transform(this.market.payDate, 'yyyy/MM/dd');
    let marketSettings = {
      expect_apr: this.market.expectApr,
      min_apr: this.market.minApr,
      reserve_percentage: this.market.reservePercentage,
      reconcilation_date: this.market.reconcilationDate
    };
    let checkMarketSetting = JSON.stringify(this.marketSettings) == JSON.stringify(marketSettings)
    if (!checkMarketSetting) {
      this._marketsService
        .setSettings(this.market)
        .subscribe(
          () => {
            this.marketOrig.updateOrigin(this.market);
            this.marketClone = null;
            // this.editMode = false;
            this._toastr.success('Market data successfully saved');
          },
          errors => this._toastr.warning('Error while saving', errors['data'])
        );
    }
    this.cancelEditing();

  }

  public saveSchedule(): void {
    const pipe = new DatePipe('EN');
    let invalidValidation: boolean;

    this.marketSchedule.schedulesList.forEach((list: any, index) => {
      if (!list.paydate || list.paydate == 'Invalid Date') {
        this._toastr.error('Plase select all the paydate');
        invalidValidation = true;
        return false;
      } else if (!list.cashamount) {
        this._toastr.error('Plase fill all the amounts');
        invalidValidation = true;
        return false;
      } else {
        let dates = pipe.transform(list.paydate, 'yyyy/MM/dd');
        let allocateId = (list.allocate_id ? list.allocate_id : (list.id ? list.id : 0));
        delete list.allocate_id;
        return list.paydate = dates, list.id = allocateId ? allocateId : 0;
      }
    });

    let mappingDate = this.marketSchedule.schedulesList.map(function (schedule) { return schedule.paydate; });
    var isDuplicate = mappingDate.some(function (list, idx) {
      return mappingDate.indexOf(list) != idx
    });
    if (!isDuplicate) {
      let marketAllocatesChanges = [];
      if (!invalidValidation) {
        this.marketSchedule.schedulesList.forEach(currentList => {
          if (currentList.id == 0) {
            marketAllocatesChanges.push(currentList);
          } else {
            this.marketAllocates.forEach(oldAllocates => {
              if ((oldAllocates.allocate_id ? oldAllocates.allocate_id : oldAllocates.id) == currentList.id) {
                if (pipe.transform(oldAllocates.paydate, 'yyyy/MM/dd') != currentList.paydate || oldAllocates.cashamount != currentList.cashamount) {
                  marketAllocatesChanges.push(currentList);
                }
              }
            });
          }
        });
        let schedules = { allocates: [] };
        schedules.allocates = marketAllocatesChanges;
        marketAllocatesChanges = [];
        this._marketsService
          .allocateSchedules(schedules, this.marketOrig.id)
          .subscribe(
            resp => {
              this._toastr.success('Successfully saves market allocate schedule');
              this.marketAllocates = JSON.parse(JSON.stringify(this.marketSchedule.schedulesList));
              this.bsModalRef.hide();
            },
            () => this._toastr.warning('Error while saving')
          )
      }
    } else {
      this._toastr.error('Plase select different paydate');
    }
  }

  public scheduleEvents(clickEvent: string, index: number, init) {
    if (init === 'add') {
      this.marketSchedule.allocateScheduleList(clickEvent, index, null)
    } else {
      let invalidValidation: boolean;
      this.marketSchedule.schedulesList.forEach((list: any, index) => {
        if (!list.paydate || list.paydate == 'Invalid Date') {
          this._toastr.error('Plase select all the paydate');
          invalidValidation = true;
          return false;
        } else if (!list.cashamount) {
          this._toastr.error('Plase fill all the amounts');
          invalidValidation = true;
          return false;
        }
      });

      if (!invalidValidation) {
        this.marketSchedule.allocateScheduleList(clickEvent, index, null)
      }
    }
  }

  public removeEvents(clickEvent: string, index: number, schedule: any) {
    let allocateId = schedule.allocate_id ? schedule.allocate_id : schedule.id;
    if (allocateId === 0) {
      this.marketSchedule.allocateScheduleList(clickEvent, index, null)
    } else {
      if (allocateId) {
        let data = { allocate_id: allocateId };
        this._marketsService
          .removeSchedules(data, this.marketOrig.id)
          .subscribe(
            resp => this._toastr.success('Market allocate schedule ' + data.allocate_id + ' is deleted ') && this.marketSchedule.allocateScheduleList(clickEvent, index, null),
            () => this._toastr.warning('Error while removing')
          )
      } else {
        this.marketSchedule.allocateScheduleList(clickEvent, index, null)
      }
    }
  }

  public checkDuplicateDate(date, index) {
    const pipe = new DatePipe('EN');
    this.marketSchedule.schedulesList[index].paydate = pipe.transform(date, 'yyyy-MM-dd');
    let mappingDate = this.marketSchedule.schedulesList.map(function (schedule) { return pipe.transform(schedule.paydate, 'yyyy-MM-dd'); });
    var isDuplicate = mappingDate.some(function (list, idx) {
      return mappingDate.indexOf(list) != idx;
    });
    if (isDuplicate) {
      this._toastr.error('Plase select different paydate');
      setTimeout(() => {
        this.marketSchedule.schedulesList[index].paydate = "";
      }, 1000);
    }
  }
}
