import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivationAccountService } from '../../services/activation-account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { PrivacyModal } from './privacy';

@Component({
  selector: 'app-activation-account',
  templateUrl: './activation-account.component.html',
  styleUrls: ['./activation-account.component.scss']
})
export class ActivationAccountComponent implements OnInit {
  public btnValue = 'show';// 显示隐藏按钮的值
  public btnType = 'password'; // 显示隐藏按钮的类型
  // 获取url的verify_code和type值
  private verifyCode = this.route.snapshot.queryParams['verify_code'] || '';
  private urlType = this.route.snapshot.queryParams['type'] || '';
  public passwordChecked = true;
  public passwordCheckedNumber = true;
  public passwordCheckedUpperCase = true;
  public passwordCheckedLowerCase = true;
  public passwordCheckedSymbol = true;
  public passwordCheckedLength = true;
  public passwordCheckedMatch = true;
  public password: string;
  public repeatedPassword: string;
  public bsModalRef: BsModalRef;

  constructor(fb: FormBuilder,
    private route: ActivatedRoute,
    private _activationAccount: ActivationAccountService,
    private modalService: BsModalService,
    private _router: Router,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
  }

  // form表单接受数据验证
  onSubmit() {
    if (!this.password) {
      this.passwordChecked = false;
      this.passwordCheckedNumber = false;
      this.passwordCheckedUpperCase = false;
      this.passwordCheckedLowerCase = false;
      this.passwordCheckedLength = false;
    } else if (!this.repeatedPassword) {
      this.passwordCheckedMatch = false;
    }
    if (this.passwordChecked && this.passwordCheckedMatch) {
      const ref = this;
      const initialState = {
        call: function call() {
          ref.savePassword();
        }
      };
      this.bsModalRef = this.modalService.show(
        PrivacyModal,
        Object.assign({ class: 'password-activation', initialState })
      );
    }
  }


  public savePassword() {
    var passwordInfo = new Object({
      passwordInfo: {
        verify_code: this.verifyCode,
        type: this.urlType,
        password: this.password,
        checkPassword: this.repeatedPassword,
      }
    });
    this._activationAccount
      .make(passwordInfo)
      .subscribe(response => { this._router.navigate(['/supplier', 'signin']); },
        error => { this._toastr.error(error); }
      );
  }

  public passwordChecking(value) {
    var regexTotal = new RegExp('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,15}');
    var atLeastNumberPattern = /^.*(?=.*\d).*$/;
    var upperCasePattern = /^.*(?=.*[A-Z]).*$/;
    var lowerCasePattern = /^.*(?=.*[a-z]).*$/;
    var numberLengthPattern = /^.*(?=.{8,}).*$/;
    var symbolPatter = new RegExp('(?=.*[^a-zA-Z0-9])');
    this.password = value;

    if (atLeastNumberPattern.test(value)) {
      this.passwordCheckedNumber = true;
    } else {
      this.passwordCheckedNumber = false;
    }
    if (upperCasePattern.test(value)) {
      this.passwordCheckedUpperCase = true;
    } else {
      this.passwordCheckedUpperCase = false;
    }
    if (lowerCasePattern.test(value)) {
      this.passwordCheckedLowerCase = true;
    } else {
      this.passwordCheckedLowerCase = false;
    }
    if (numberLengthPattern.test(value)) {
      this.passwordCheckedLength = true;
    } else {
      this.passwordCheckedLength = false;
    }
    if (symbolPatter.test(value)) {
      this.passwordCheckedSymbol = false;
    } else {
      this.passwordCheckedSymbol = true;
    }
    if (regexTotal.test(value) && !symbolPatter.test(value)) {
      this.passwordChecked = true;
    } else {
      this.passwordChecked = false;
    }
    if (this.repeatedPassword) {
      this.passwordMatching(this.repeatedPassword);
    }
  }

  public passwordMatching(value) {
    this.repeatedPassword = value;
    if (this.password == this.repeatedPassword) {
      this.passwordCheckedMatch = true;
    } else {
      this.passwordCheckedMatch = false;
    }
  }

  // 密码框显示隐藏按钮方法
  public check() {
    // 判断按钮是否为显示或隐藏进行密码显示隐藏
    if (this.btnValue === 'show') {
      this.btnValue = 'hide';
      this.btnType = 'text';
    } else {
      this.btnValue = 'show';
      this.btnType = 'password';
    }
  }
}
