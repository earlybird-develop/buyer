import {
  Attribute, Component, EventEmitter, forwardRef, Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'eb-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent implements ControlValueAccessor {
  public model = false;
  private onOffMode = false;
  private fixed = false;
  private confirmable = false;

  @Output()
  public change: EventEmitter<boolean> = new EventEmitter();

  private _propagateChange: Function = () => null;

  // @Attribute('onOffMode') onOffMode,
  constructor(@Attribute('static') fixed,
              @Attribute('confirmable') confirmable) {
    this.onOffMode = true; // typeof onOffMode === 'string';
    this.fixed = typeof fixed === 'string';
    this.confirmable = typeof confirmable === 'string';
  }

  public toggle(): void {
    if (this.fixed) {
      return;
    }

    if (!this.confirmable) {
      this.model = !this.model;
      this._propagateChange(this.model);
    }

    this.change.emit(!this.model);
  }

  writeValue(value: boolean) {
    this.model = value;
  }

  registerOnChange(fn: Function) {
    this._propagateChange = fn;
  }

  registerOnTouched(fn) { }

  setDisabledState(fn) { }
}
