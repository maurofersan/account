import {
  Directive,
  ElementRef,
  forwardRef,
  Input,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'std-button[appStdButton]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StdButtonDirective),
      multi: true,
    },
  ],
})
export class StdButtonDirective implements ControlValueAccessor, OnInit {
  @Input() disabled: boolean = false;

  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.elementRef.nativeElement.addEventListener('click', (event: Event) => {
      if (!this.disabled) {
        this.onChange(true);
        this.onTouched();
      }
    });
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    // The std-button handles its own state
  }

  registerOnChange(fn: (value: any) => void): void {
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
