import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Nl2brPipe } from '../../pipes/nl2br.pipe';

@Component({
  selector: 'app-contract-modal',
  standalone: true,
  imports: [Nl2brPipe],
  templateUrl: './contract-modal.component.html',
  styleUrl: './contract-modal.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ContractModalComponent implements AfterViewInit {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() content = '';
  @Input() agreeButtonText = '';
  @Output() close = new EventEmitter<void>();
  @Output() agree = new EventEmitter<void>();
  
  @ViewChild('scrollableContent', { static: false }) scrollableContent!: ElementRef;
  private scrollTimeout: any;

  ngAfterViewInit(): void {
    if (this.scrollableContent) {
      this.setupScrollListener();
    }
  }

  private setupScrollListener(): void {
    const element = this.scrollableContent.nativeElement;
    
    element.addEventListener('scroll', () => {
      element.classList.add('scrolling');
      
      // Limpiar timeout anterior
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }
      
      // Ocultar scrollbar después de 1 segundo sin scroll
      this.scrollTimeout = setTimeout(() => {
        element.classList.remove('scrolling');
      }, 1000);
    });
  }

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
