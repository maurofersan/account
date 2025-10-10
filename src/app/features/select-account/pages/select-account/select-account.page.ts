import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef,
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
  imageSlider1Url = '';
  imageSlider2Url = '';

  @ViewChildren('cardItem') cardItems!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChildren('carousel') carouselList!: QueryList<ElementRef<HTMLDivElement>>;

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
        name: 'Ahorra a tu ritmo',
        type: 'Cuenta Imparable',
        badge: 'Cuenta Imparable',
        imageUrl: this.imageSlider1Url,
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
        imageUrl: this.imageSlider2Url,
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
  onAccountSelect(account: Account, index?: number): void {
    this.selectedAccount = account;
    this.accountStore.setSelectedAccount(account);
    if (index !== undefined) {
      this.scrollToCard(index);
    }
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

  private scrollToCard(index: number): void {
    const items = this.cardItems?.toArray();
    const carousel = this.carouselList?.first?.nativeElement;
    if (!items || !items[index] || !carousel) return;

    const itemEl = items[index].nativeElement;
    const carouselRect = carousel.getBoundingClientRect();
    const itemRect = itemEl.getBoundingClientRect();
    const currentScroll = carousel.scrollLeft;
    const itemCenter = itemRect.left - carouselRect.left + currentScroll + itemRect.width / 2;
    const targetScroll = Math.max(0, itemCenter - carouselRect.width / 2);
    carousel.scrollTo({ left: targetScroll, behavior: 'smooth' });
  }
}
