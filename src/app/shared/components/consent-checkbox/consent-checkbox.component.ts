import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-consent-checkbox',
  standalone: true,
  imports: [],
  templateUrl: './consent-checkbox.component.html',
  styleUrl: './consent-checkbox.component.scss',
})
export class ConsentCheckboxComponent {
  @Input() checked: boolean = false;
  @Input() text: string = '';
  @Input() highlight1: string = '';
  @Input() suffix: string = '';
  @Input() highlight2: string = '';
  @Output() change = new EventEmitter<boolean>();
  @Output() openContract = new EventEmitter<void>();

  onCheckboxChange(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLInputElement;
    const newValue = !this.checked; // Toggle the current value
    this.change.emit(newValue);
  }

  onContractClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.openContract.emit();
  }
}
