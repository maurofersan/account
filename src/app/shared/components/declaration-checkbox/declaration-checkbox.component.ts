import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-declaration-checkbox',
  standalone: true,
  templateUrl: './declaration-checkbox.component.html',
  styleUrl: './declaration-checkbox.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DeclarationCheckboxComponent {
  @Input() checked = false;
  @Input() text = '';
  @Output() change = new EventEmitter<boolean>();

  onCheckboxChange(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const newValue = !this.checked; // Toggle the current value
    this.change.emit(newValue);
  }
}
