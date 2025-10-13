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

  onCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.change.emit(target.checked);
  }
}
