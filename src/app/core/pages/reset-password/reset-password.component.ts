import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  // 显示隐藏按钮的值
  public btnValue = '显示';
  // 显示隐藏按钮的类型
  public btnType = 'password';

  // 自定义密码校验器
  passwordValidator(group: FormGroup): any {
    // tslint:disable-next-line:max-line-length
    let password: FormControl = group.get('password') as FormControl;
    // tslint:disable-next-line:max-line-length
    let checkPassword: FormControl = group.get('checkPassword') as FormControl;
    let valid: boolean = (password.value === checkPassword.value);
    // console.log('密码校验结果:' + valid);
    return valid ? null : { equal: { errorInfo: '密码和确认密码不一致'}};
  }

  // 定义表单属性名称
  // tslint:disable-next-line:member-ordering
  formModel: FormGroup;

  constructor(fb: FormBuilder) {
    // 响应式表单构造方法
    this.formModel = fb.group({
      passwordInfo: fb.group({
        // 设置密码和确认密码值为空，校验条件为必填和最少长度为8
        password: ['', [Validators.required, Validators.minLength(8) ]],
        checkPassword: ['', [ Validators.required, Validators.minLength(8) ]]
      }, { validator: this.passwordValidator})
    })
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
    if (this.btnValue === '显示') {
      this.btnValue = '隐藏';
      this.btnType = 'text';
    } else {
      this.btnValue = '显示';
      this.btnType = 'password';
    }
  }


}
