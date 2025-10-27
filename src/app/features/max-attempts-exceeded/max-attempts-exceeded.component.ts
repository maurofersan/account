import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TextService } from '../../core/services/text.service';

@Component({
  selector: 'app-max-attempts-exceeded',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './max-attempts-exceeded.component.html',
  styleUrl: './max-attempts-exceeded.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MaxAttemptsExceededComponent implements OnInit {
  textsLoaded = false;
  
  // Text properties
  consumerText = '';
  title = '';
  subtitle = '';
  backButtonText = '';

  constructor(
    private router: Router,
    private textService: TextService
  ) {}

  ngOnInit(): void {
    this.loadTexts();
  }

  private loadTexts(): void {
    this.textService.loadTexts().subscribe({
      next: (texts) => {
        this.consumerText = this.textService.getText('max-attempts.consumer');
        this.title = this.textService.getText('max-attempts.title');
        this.subtitle = this.textService.getText('max-attempts.subtitle');
        this.backButtonText = this.textService.getText('max-attempts.backButton');
        this.textsLoaded = true;
      },
      error: (error) => {
        console.error('Error loading texts:', error);
        // Set fallback texts
        this.consumerText = 'CONSUMER';
        this.title = 'Has superado el máximo de intentos';
        this.subtitle = 'Acércate a una agencia para continuar con tu proceso';
        this.backButtonText = 'Volver';
        this.textsLoaded = true;
      }
    });
  }

  onBackClick(): void {
    this.router.navigate(['/account-summary']);
  }
}
