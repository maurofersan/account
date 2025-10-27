import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TextService } from '../../core/services/text.service';

@Component({
  selector: 'app-page-load-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-load-error.component.html',
  styleUrl: './page-load-error.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PageLoadErrorComponent implements OnInit {
  textsLoaded = false;
  
  // Text properties
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
        this.title = this.textService.getText('page-load-error.title');
        this.subtitle = this.textService.getText('page-load-error.subtitle');
        this.backButtonText = this.textService.getText('page-load-error.backButton');
        this.textsLoaded = true;
      },
      error: (error) => {
        console.error('Error loading texts:', error);
        // Set fallback texts
        this.title = 'Ups... algo salió mal';
        this.subtitle = 'No pudimos cargar la página. Intenta nuevamente en unos minutos.';
        this.backButtonText = 'Volver';
        this.textsLoaded = true;
      }
    });
  }

  onBackClick(): void {
    this.router.navigate(['/account-summary']);
  }
}
