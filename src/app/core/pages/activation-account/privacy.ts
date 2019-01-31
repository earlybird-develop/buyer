import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'privacy',
  templateUrl: './privacy.html',
  styleUrls: ['./privacy.scss']
})

export class PrivacyModal implements OnInit {
  public privacyContent: any;
  public call: any;
  constructor(public bsModalRef: BsModalRef, public http: HttpClient) { }

  ngOnInit() {
    this.http.get('/assets/privacy.txt', { responseType: 'text' }).subscribe(data => {
      this.privacyContent = data;
    }, error => {
      console.log(error);
    });
  }

  public agree() {
    this.bsModalRef.hide();
    this.call();
  }
}