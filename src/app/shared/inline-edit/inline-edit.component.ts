import {
  Component, Input, forwardRef, Output, EventEmitter, Attribute
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'eb-inline-edit',
  templateUrl: './inline-edit.component.html',
  styleUrls: ['./inline-edit.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InlineEditComponent),
      multi: true
    }
  ]
})
export class InlineEditComponent implements ControlValueAccessor {
  public isOpen = false;
  public value: number;
  public newValue: number;
  public black = false;
  @Input()
  public disabled = false;

  @Input()
  public placeholder = '';

  @Output('change')
  public change: EventEmitter<number> = new EventEmitter();

  private _propagateChange: Function = () => null;

  constructor(@Attribute('black') _black: string) {
    this.black = typeof _black === 'string';
  }

  public apply(): void {
    this._propagateChange(this.value);
    this.close();
  }

  public cancel(): void {
    this.value = this.newValue;
    this.close();
  }

  public open(): void {
    if (!this.disabled) {
      this.isOpen = true;
    }
  }

  public close(): void {
    this.isOpen = false;
  }

  writeValue(value: number) {
    this.value = value;
    this.newValue = this.value;
  }

  registerOnChange(fn: Function) {
    this._propagateChange = fn;
  }

  registerOnTouched(fn) { }

  setDisabledState(fn) { }
}
