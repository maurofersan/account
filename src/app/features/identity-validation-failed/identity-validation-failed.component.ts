import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TextService } from '../../core/services/text.service';

@Component({
  selector: 'app-identity-validation-failed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './identity-validation-failed.component.html',
  styleUrl: './identity-validation-failed.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class IdentityValidationFailedComponent implements OnInit {
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
        this.consumerText = this.textService.getText('identity-validation.consumer');
        this.title = this.textService.getText('identity-validation.title');
        this.subtitle = this.textService.getText('identity-validation.subtitle');
        this.backButtonText = this.textService.getText('identity-validation.backButton');
        this.textsLoaded = true;
      },
      error: (error) => {
        console.error('Error loading texts:', error);
        // Set fallback texts
        this.consumerText = 'Consumer';
        this.title = 'No pudimos validar tu identidad';
        this.subtitle = 'Vuelve a intentarlo en xx minutos/horas';
        this.backButtonText = 'Volver';
        this.textsLoaded = true;
      }
    });
  }

  onBackClick(): void {
    this.router.navigate(['/account-summary']);
  }
}
