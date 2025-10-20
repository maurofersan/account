import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
    FormsModule,
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

  // Validation states
  roadNameError = false;
  roadNumberError = false;

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
   * Handles road name change event from std-input
   */
  onRoadNameChange(event: any): void {
    this.addressData.roadName = event.detail;
    this.validateRoadName();
  }

  /**
   * Handles road number change event from std-input
   */
  onRoadNumberChange(event: any): void {
    this.addressData.roadNumber = event.detail;
    this.validateRoadNumber();
  }

  /**
   * Validates road name field
   */
  validateRoadName(): void {
    this.roadNameError = this.addressData.roadName.length < 2;
  }

  /**
   * Validates road number field
   */
  validateRoadNumber(): void {
    this.roadNumberError = this.addressData.roadNumber.length < 2;
  }

  /**
   * Checks if continue button should be enabled
   */
  get canContinue(): boolean {
    return this.consentAccepted && !this.roadNameError && !this.roadNumberError;
  }
}
