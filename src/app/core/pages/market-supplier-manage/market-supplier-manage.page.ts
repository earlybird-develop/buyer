import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { SuppliersService } from '../../services';
import { Supplier, SuppliersStat, User } from '../../models';


@Component({
  selector: 'eb-market-supplier-manage',
  templateUrl: './market-supplier-manage.page.html',
  styleUrls: ['./market-supplier-manage.page.scss']
})
export class MarketSupplierManagePage implements OnInit {

  public stat: SuppliersStat;
  public marketId: string;
  public suppliers: Supplier[] = [];

  constructor(private _suppliersService: SuppliersService,
              private _route: ActivatedRoute,
              private _toastr: ToastrService) { }

  ngOnInit() {
    this.marketId = this._route.parent.snapshot.params.id;

    this._suppliersService
      .getSuppliers(this.marketId)
      .subscribe(
        x => this.suppliers = x,
        () => this._toastr.error('Internal server error')
      );


    this._suppliersService
      .getSuppliersStat(this.marketId)
      .subscribe(
        x => this.stat = x,
        () => this._toastr.error('Internal server error')
      );
  }

  public setSupplierUsers(supplier: Supplier): void {
    if (supplier._showDetails) {
      supplier.clearUsers();
    } else {
      this._suppliersService
        .getSupplierUsers(supplier.id, this.marketId)
        .subscribe(
          x => supplier.users = x,
          () => this._toastr.error('Internal server error')
        );
    }

    supplier._showDetails = !supplier._showDetails;
  }

  public setUserAction(user: User, id: string): void {
    this._suppliersService
      .setUserAction(user.registeredEvent, id)
      .subscribe(
        () => this._toastr.success('Invitation sent!'),
        () => this._toastr.error('Internal server error')
      );
  }

  public calculatePersentage(val1: number, val2: number): string {
    return val1 / val2 * 100 + '%';
  }
}
