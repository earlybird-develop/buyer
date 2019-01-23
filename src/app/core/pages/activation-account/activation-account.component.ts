import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivationAccountService } from '../../services/activation-account.service';
import { Router, ActivatedRoute } from '@angular/router';

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

  // 自定义密码与确认密码校验
  passwordValidator(group: FormGroup): any {
    const password: FormControl = group.get('password') as FormControl;
    const checkPassword: FormControl = group.get('checkPassword') as FormControl;
    const valid: boolean = (password.value === checkPassword.value);
    return valid ? null : { equal: { errorInfo: 'true' } };
  }
  // 自定义包含最少1个数字校验
  leastOneNum(control: FormControl): any {
    // 正则表达式判断是否有一个数字
    const onlyNum = /\d+/;
    const valid = onlyNum.test(control.value);
    return valid ? null : { onlyNum: { number: 'true' } };
  }

  // 自定义包含最少1个小写字母校验
  leastOneLeter(control: FormControl): any {
    // 正则表达式判断是否有一个小写字母
    const onlyLetter = /[a-z]+/;
    const valid = onlyLetter.test(control.value);
    return valid ? null : { onlyLetter: { letter: 'true' } };
  }

  // 自定义包含最少1个大写字母校验
  leastOneCapital(control: FormControl): any {
    // 正则表达式判断是否有一个大写字母
    const onlyCapital = /[A-Z]+/;
    const valid = onlyCapital.test(control.value);
    return valid ? null : { onlyCapital: { capital: 'true' } };
  }

  // 自定义禁止非数字非字母校验
  SpecialCharacter(control: FormControl): any {
    // 正则表达式判断是否有禁止非数字非字母
    const onlySpecial = /\W+/;
    const valid = onlySpecial.test(control.value);
    return valid ? { onlySpecial: { special: 'true' } } : null;
  }

  // 定义表单属性名称
  formModel: FormGroup;

  constructor(fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _activationAccount: ActivationAccountService) {
    // 响应式表单构造方法
    this.formModel = fb.group({
      passwordInfo: fb.group({
        // 设置密码和确认密码值为空，校验条件为必填和最少长度为8
        password: ['', [Validators.required, Validators.minLength(8), this.leastOneNum, this.leastOneLeter, this.leastOneCapital, this.SpecialCharacter]],
        checkPassword: ['', [Validators.required, Validators.minLength(8)]]
      }, { validator: this.passwordValidator })
    });
  }

  ngOnInit() {
  }

  // form表单接受数据验证
  onSubmit() {
    // 当点击继续时，所有值满足条件才打印值
    if (this.formModel.valid) {
      this.formModel.value.passwordInfo.verify_code = this.verifyCode;
      this.formModel.value.passwordInfo.type = this.urlType;

      this._activationAccount
        .make(this.formModel.value)
        .subscribe(
          error => ''
        );
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
