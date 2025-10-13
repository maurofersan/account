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
  UserData,
  AccountDetails,
} from '../../../../shared/interfaces/account.interfaces';

@Component({
  selector: 'app-account-success-page',
  standalone: true,
  imports: [],
  templateUrl: './account-success.page.html',
  styleUrl: './account-success.page.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccountSuccessPageComponent
  extends BaseComponent
  implements OnInit
{
  userData: UserData = {
    fullName: 'CARLOS ALBERTO MORALES RODRIGUEZ',
    firstName: 'Carlos Alberto',
    lastName: 'Morales Rodriguez',
  };

  accountDetails: AccountDetails = {
    type: 'Cuenta Libre',
    currency: 'Soles',
  };

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
   * Navigates to find branch page
   */
  findBranch(): void {
    // Navigate to branch finder or external link
    console.log('Finding nearest branch...');
  }
}
