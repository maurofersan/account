import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { BaseComponent } from '../../../../shared/base/base.component';
import { TextService } from '../../../../core/services/text.service';
import { AccountStoreService } from '../../../../core/services/account-store.service';
import { AccountApiService } from '../../../../core/services/account-api.service';
import { MountPathService } from '../../../../core/services/mount-path.service';
import {
  AccountNavigationComponent,
  AccountTitleSectionComponent,
  AccountCardComponent,
  CurrencySelectorComponent,
} from '../../../../shared/components';
import { StdButtonDirective } from '../../../../shared/directives';
import { PrefixAssetPipe } from '../../../../shared/pipes/prefix-asset.pipe';
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
    PrefixAssetPipe,
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
  imageSlider1Url = '';
  imageSlider2Url = '';


  private textService = inject(TextService);
  private accountStore = inject(AccountStoreService);
  private accountApi = inject(AccountApiService);
  private router = inject(Router);
  private mountPathService = inject(MountPathService);

  ngOnInit(): void {
    this.textService.loadTexts('es').subscribe();
    this.initializeImageResources();
    this.loadAccounts();
  }

  /**
   * Gets text by key with fallback support
   */
  getText(key: string, params?: { [key: string]: string | number }): string {
    return this.textService.getText(key, params);
  }

  /**
   * Initializes image resources with microfrontend mount path
   */
  private initializeImageResources(): void {
    this.mountPathService.mountPath$.pipe(take(1)).subscribe({
      next: (mountPath) => {
        const basePath = mountPath || '/';
        this.imageSlider1Url = `${basePath}assets/images/image-slider1.svg`;
        this.imageSlider2Url = `${basePath}assets/images/image-slider2.svg`;
      },
      error: (err) => {
        console.error('[SelectAccountPage] Error to get mountPath:', err);
        // Fallback a rutas estáticas
        this.imageSlider1Url = '/assets/images/image-slider1.svg';
        this.imageSlider2Url = '/assets/images/image-slider2.svg';
      },
    });
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
        name: this.getAccountText('imparable', 'name'),
        type: this.getAccountText('imparable', 'type'),
        badge: this.getAccountText('imparable', 'badge'),
        imageUrl: this.imageSlider1Url,
        interestRate: { soles: 4.6, dollars: 2.5 },
        maintenanceCost: this.getAccountText('imparable', 'features.maintenance'),
        minimumBalance: 'S/500',
        features: [
          {
            id: '1',
            text: this.getAccountText('imparable', 'features.interest'),
          },
          {
            id: '2',
            text: this.getAccountText('imparable', 'features.dispose'),
          },
          {
            id: '3',
            text: this.getAccountText('imparable', 'features.maintenance'),
          },
        ],
      },
      {
        id: '2',
        name: this.getAccountText('libre', 'name'),
        type: this.getAccountText('libre', 'type'),
        badge: this.getAccountText('libre', 'badge'),
        imageUrl: this.imageSlider2Url,
        interestRate: { soles: 0, dollars: 0 },
        maintenanceCost: 'S/0',
        minimumBalance: 'S/0',
        features: [
          {
            id: '1',
            text: this.getAccountText('libre', 'features.minimum'),
          },
          {
            id: '2',
            text: this.getAccountText('libre', 'features.operations'),
          },
        ],
      },
    ];

    this.isLoading = false;
  }

  /**
   * Gets account text with fallback
   */
  private getAccountText(accountType: string, key: string): string {
    const fullKey = `account.select-account.accounts.${accountType}.${key}`;
    const text = this.getText(fullKey);
    
    // Fallback to static values if i18n is not loaded
    if (text === fullKey) {
      return this.getStaticAccountText(accountType, key);
    }
    
    return text;
  }

  /**
   * Gets static account text as fallback
   */
  private getStaticAccountText(accountType: string, key: string): string {
    const staticTexts: { [key: string]: { [key: string]: string } } = {
      imparable: {
        name: 'Ahorra a tu ritmo',
        type: 'Cuenta Imparable',
        badge: 'Cuenta Imparable',
        'features.interest': 'Gana intereses: <b>4.6%</b> desde S/500 y <b>2.5%</b> en dólares',
        'features.dispose': 'Dispón de tu dinero cuando lo necesites.',
        'features.maintenance': 'Sin costo de mantenimiento, con saldo promedio desde S/500'
      },
      libre: {
        name: 'Para tu día a día',
        type: 'Cuenta Libre',
        badge: 'Cuenta Libre',
        'features.minimum': 'Sin monto mínimo de apertura',
        'features.operations': 'Operaciones ilimitadas sin costo en agencias, App y cajero'
      }
    };

    return staticTexts[accountType]?.[key] || key;
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

  /**
   * Handles image loading errors
   */
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }

}
