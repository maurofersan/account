import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-account-navigation',
  standalone: true,
  imports: [],
  templateUrl: './account-navigation.component.html',
  styleUrl: './account-navigation.component.scss',
})
export class AccountNavigationComponent {
  @Input() backButtonText: string = 'Volver';
  @Input() disabled: boolean = false;
  @Output() backClick = new EventEmitter<void>();

  onBackClick(): void {
    if (!this.disabled) {
      this.backClick.emit();
    }
  }
}
