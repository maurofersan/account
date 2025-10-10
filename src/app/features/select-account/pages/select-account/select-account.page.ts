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
  AccountCardComponent,
  CurrencySelectorComponent,
} from '../../../../shared/components';
import { StdButtonDirective } from '../../../../shared/directives';
import {
  Account,
  Currency,
} from '../../../../shared/interfaces/account.interfaces';

@Component({
  selector: 'app-select-account-page',
  standalone: true,
  imports: [
    AccountNavigationComponent,
    AccountTitleSectionComponent,
    AccountCardComponent,
    CurrencySelectorComponent,
    StdButtonDirective,
  ],
  templateUrl: './select-account.page.html',
  styleUrl: './select-account.page.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SelectAccountPageComponent
  extends BaseComponent
  implements OnInit
{
  accounts: Account[] = [];
  currencies: Currency[] = [
    { code: 'PEN', name: 'Soles', symbol: 'S/' },
    { code: 'USD', name: 'Dólares', symbol: 'US$' },
  ];
  selectedAccount: Account | null = null;
  selectedCurrency: Currency = this.currencies[0];
  isLoading = false;

  private textService = inject(TextService);
  private accountStore = inject(AccountStoreService);
  private accountApi = inject(AccountApiService);
  private router = inject(Router);

  ngOnInit(): void {
    this.textService.loadTexts('es').subscribe();
    this.loadAccounts();
  }

  /**
   * Gets text by key with fallback support
   */
  getText(key: string, params?: { [key: string]: string | number }): string {
    return this.textService.getText(key, params);
  }

  /**
   * Loads available accounts
   */
  private loadAccounts(): void {
    this.isLoading = true;

    // Mock data for now - in real app this would come from API
    this.accounts = [
      {
        id: '1',
        name: 'Ahorra a tu ritmo',
        type: 'Cuenta Imparable',
        badge: 'Cuenta Imparable',
        imageUrl:
          'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
        interestRate: { soles: 4.6, dollars: 2.5 },
        maintenanceCost:
          'Sin costo de mantenimiento, con saldo promedio desde S/500',
        minimumBalance: 'S/500',
        features: [
          {
            id: '1',
            text: 'Gana intereses: <b>4.6%</b> desde S/500 y <b>2.5%</b> en dólares',
          },
          {
            id: '2',
            text: 'Dispón de tu dinero cuando lo necesites.',
          },
          {
            id: '3',
            text: 'Sin costo de mantenimiento, con saldo promedio desde S/500',
          },
        ],
      },
      {
        id: '2',
        name: 'Para tu crecimiento',
        type: 'Cuenta Progresiva',
        badge: 'Cuenta Progresiva',
        imageUrl:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        interestRate: { soles: 3.2, dollars: 1.8 },
        maintenanceCost: 'Sin costo de mantenimiento',
        minimumBalance: 'S/1000',
        features: [
          {
            id: '1',
            text: 'Opera sin costo',
          },
          {
            id: '2',
            text: 'Sin costo de mantenimiento',
          },
          {
            id: '3',
            text: 'Sin movimientos limitados',
          },
        ],
      },
    ];

    this.isLoading = false;
  }

  /**
   * Handles account selection
   */
  onAccountSelect(account: Account): void {
    this.selectedAccount = account;
    this.accountStore.setSelectedAccount(account);
  }

  /**
   * Handles currency selection
   */
  onCurrencySelect(currency: Currency): void {
    this.selectedCurrency = currency;
    this.accountStore.setSelectedCurrency(currency);
  }

  /**
   * Continues to the next step
   */
  continue(): void {
    if (this.selectedAccount && this.selectedCurrency) {
      this.accountStore.setCurrentStep('account-summary');
      this.router.navigate(['/cuenta/resumen-cuenta']);
    }
  }

  /**
   * Navigates back to previous page
   */
  goBack(): void {
    this.router.navigate(['/']);
  }

  /**
   * Checks if continue button should be enabled
   */
  get canContinue(): boolean {
    return !!this.selectedAccount && !!this.selectedCurrency;
  }
}
