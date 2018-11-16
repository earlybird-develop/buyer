import { Component, OnInit } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { FormGroup, ReactiveFormsModule, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  // 显示隐藏按钮的值
  public btnValue = 'show';
  // 显示隐藏按钮的类型
  public btnType = 'password';


  // 自定义密码与确认密码校验
  passwordValidator(group: FormGroup): any {
    // tslint:disable-next-line:max-line-length
    const password: FormControl = group.get('password') as FormControl;
    // tslint:disable-next-line:max-line-length
    const checkPassword: FormControl = group.get('checkPassword') as FormControl;
    const valid: boolean = (password.value === checkPassword.value);
    return valid ? null : { equal: { errorInfo: 'true'}};
  }

  // 自定义包含最少1个数字校验
  leastOneNum(control: FormControl): any {
    // 正则表达式判断是否有一个数字
    const onlyNum = /\d+/;
    const valid = onlyNum.test( control.value );
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
  // tslint:disable-next-line:member-ordering
  formModel: FormGroup;

  constructor(fb: FormBuilder) {
    // 响应式表单构造方法
    this.formModel = fb.group({
      passwordInfo: fb.group({
        // 设置密码和确认密码值为空，校验条件为必填和最少长度为8
        // tslint:disable-next-line:max-line-length
        password: ['', [Validators.required, Validators.minLength(8), this.leastOneNum, this.leastOneLeter, this.leastOneCapital, this.SpecialCharacter]],
        checkPassword: ['', [ Validators.required, Validators.minLength(8) ]]
      }, { validator: this.passwordValidator})
    });
   }

  ngOnInit() {
  }

  // form表单接受数据验证
  onSubmit() {
    // 当点击继续时，所有值满足条件才打印值
    if (this.formModel.valid) {
      console.log(this.formModel.value);
    }
    // 获取password的校验结果
    // let isValid: boolean = this.formModel.get('passwordInfo.password').valid;
    // 打印password的值
    // console.log('password校验结果：' + isValid);
    // 获取password的错误信息
    // let errors: any = this.formModel.get('passwordInfo.password').errors;
    // 打印password的错误信息
    // console.log('password错误结果：' + JSON.stringify(errors));
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
