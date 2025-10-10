import {
  Directive,
  ElementRef,
  forwardRef,
  Input,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'std-radio-group[appStdRadioGroup]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StdRadioGroupDirective),
      multi: true,
    },
  ],
})
export class StdRadioGroupDirective implements ControlValueAccessor, OnInit {
  @Input() disabled: boolean = false;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.elementRef.nativeElement.addEventListener(
      'changeEvent',
      (event: CustomEvent) => {
        const value = event.detail || '';
        this.onChange(value);
        this.onTouched();
      }
    );
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    if (this.elementRef.nativeElement) {
      this.elementRef.nativeElement.value = value || '';
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.elementRef.nativeElement.disabled = isDisabled;
  }
}
