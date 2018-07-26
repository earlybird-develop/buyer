import { Attribute, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


export interface ISelectOption {
  id: number;
  value: string;
}

@Component({
  selector: 'eb-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true
    }
  ]
})
export class CustomSelectComponent implements ControlValueAccessor {
  public selectedOption: ISelectOption;

  @Input() public options: ISelectOption[];
  @Input() public placeholder: string;
  @Input() public title: string;

  private _propagateChange: Function = () => null;

  constructor() {
  }

  public selectOption(option: ISelectOption): void {
    this.selectedOption = option;
    this._propagateChange(this.selectedOption);
  }

  writeValue(value: ISelectOption) {
    this.selectedOption = value;
  }

  registerOnChange(fn: Function) {
    this._propagateChange = fn;
  }

  registerOnTouched(fn) { }

  setDisabledState(fn) { }
}
