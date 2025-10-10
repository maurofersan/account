import { Injectable, signal, computed } from '@angular/core';
import {
  AccountState,
  Account,
  Currency,
} from '../../shared/interfaces/account.interfaces';

const initialState: AccountState = {
  currentStep: 'select-account',
  selectedAccount: null,
  selectedCurrency: { code: 'PEN', name: 'Soles', symbol: 'S/' },
  isLoading: false,
  error: null,
};

@Injectable({
  providedIn: 'root',
})
export class AccountStoreService {
  private _state = signal<AccountState>(initialState);

  // Getters
  readonly state = this._state.asReadonly();
  readonly currentStep = computed(() => this._state().currentStep);
  readonly selectedAccount = computed(() => this._state().selectedAccount);
  readonly selectedCurrency = computed(() => this._state().selectedCurrency);
  readonly isLoading = computed(() => this._state().isLoading);
  readonly error = computed(() => this._state().error);

  // Actions
  setCurrentStep(step: AccountState['currentStep']): void {
    this._state.update((state) => ({ ...state, currentStep: step }));
  }

  setSelectedAccount(account: Account | null): void {
    this._state.update((state) => ({ ...state, selectedAccount: account }));
  }

  setSelectedCurrency(currency: Currency): void {
    this._state.update((state) => ({ ...state, selectedCurrency: currency }));
  }

  setLoading(loading: boolean): void {
    this._state.update((state) => ({ ...state, isLoading: loading }));
  }

  setError(error: string | null): void {
    this._state.update((state) => ({ ...state, error }));
  }

  clearError(): void {
    this._state.update((state) => ({ ...state, error: null }));
  }

  reset(): void {
    this._state.set(initialState);
  }

  // Computed values
  readonly isAccountSelected = computed(() => !!this._state().selectedAccount);
  readonly canProceed = computed(
    () => this.isAccountSelected() && !!this._state().selectedCurrency
  );
}
