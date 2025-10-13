import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../../shared/base/base.component';
import { TextService } from '../../../../core/services/text.service';
import { AccountStoreService } from '../../../../core/services/account-store.service';
import { AccountApiService } from '../../../../core/services/account-api.service';
import {
  AccountNavigationComponent,
  AccountTitleSectionComponent,
  ConsentCheckboxComponent,
} from '../../../../shared/components';
import { StdButtonDirective } from '../../../../shared/directives';

@Component({
  selector: 'app-account-summary-page',
  standalone: true,
  imports: [
    AccountNavigationComponent,
    AccountTitleSectionComponent,
    ConsentCheckboxComponent,
    StdButtonDirective,
  ],
  templateUrl: './account-summary.page.html',
  styleUrl: './account-summary.page.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccountSummaryPageComponent
  extends BaseComponent
  implements OnInit
{
  personalData = {
    fullName: 'CARLOS ALBERTO MORALES RODRIGUEZ',
    dni: '87654321',
    birthDate: '07/08/1981',
    maritalStatus: '',
    gender: '',
  };

  addressData = {
    roadType: '',
    roadName: '',
    roadNumber: '',
    department: 'Lima',
    district: '',
  };

  contactData = {
    mobile: '987 654 321',
    email: 'ejemplo@correo.com',
  };

  newAccountData = {
    type: 'Cuenta Libre',
    currency: 'Soles',
  };

  consentAccepted = false;

  private textService = inject(TextService);
  private accountStore = inject(AccountStoreService);
  private accountApi = inject(AccountApiService);
  private router = inject(Router);

  ngOnInit(): void {
    this.textService.loadTexts('es').subscribe();
  }

  /**
   * Gets text by key with fallback support
   */
  getText(key: string, params?: { [key: string]: string | number }): string {
    return this.textService.getText(key, params);
  }

  /**
   * Handles consent change
   */
  onConsentChange(checked: boolean): void {
    this.consentAccepted = checked;
  }

  /**
   * Continues to the next step
   */
  continue(): void {
    if (this.consentAccepted) {
      // Navigate to success page
      this.accountStore.setCurrentStep('account-success');
      this.router.navigate(['/cuenta/cuenta-activada']);
    }
  }

  /**
   * Navigates back to previous page
   */
  goBack(): void {
    this.router.navigate(['/cuenta/seleccionar-cuenta']);
  }

  /**
   * Checks if continue button should be enabled
   */
  get canContinue(): boolean {
    return this.consentAccepted;
  }
}
