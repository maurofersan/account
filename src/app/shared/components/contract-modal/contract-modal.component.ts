import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Nl2brPipe } from '../../pipes/nl2br.pipe';

@Component({
  selector: 'app-contract-modal',
  standalone: true,
  imports: [Nl2brPipe],
  templateUrl: './contract-modal.component.html',
  styleUrl: './contract-modal.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ContractModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() content = '';
  @Input() agreeButtonText = '';
  @Output() close = new EventEmitter<void>();
  @Output() agree = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onAgree(): void {
    this.agree.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
