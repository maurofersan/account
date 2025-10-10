export interface AccountState {
  currentStep: 'select-account' | 'account-summary' | 'account-success';
  selectedAccount: Account | null;
  selectedCurrency: Currency;
  isLoading: boolean;
  error: string | null;
}

export interface Account {
  id: string;
  name: string;
  type: string;
  badge: string;
  features: AccountFeature[];
  imageUrl: string;
  interestRate: {
    soles: number;
    dollars: number;
  };
  maintenanceCost: string;
  minimumBalance: string;
}

export interface AccountFeature {
  id: string;
  text: string;
  highlighted?: boolean;
}

export interface Currency {
  code: 'PEN' | 'USD';
  name: string;
  symbol: string;
}

export interface AccountSelectionRequest {
  accountId: string;
  currency: Currency;
}

export interface AccountSelectionResponse {
  success: boolean;
  message?: string;
  data?: {
    accountId: string;
    currency: Currency;
    accountNumber?: string;
  };
}

export interface UserData {
  fullName: string;
  firstName: string;
  lastName: string;
}

export interface AccountDetails {
  type: string;
  currency: string;
}

export interface Account {
  id: string;
  name: string;
  type: string;
  badge: string;
  features: AccountFeature[];
  imageUrl: string;
  interestRate: {
    soles: number;
    dollars: number;
  };
  maintenanceCost: string;
  minimumBalance: string;
}

export interface AccountFeature {
  id: string;
  text: string;
  highlighted?: boolean;
}

export interface Currency {
  code: 'PEN' | 'USD';
  name: string;
  symbol: string;
}

export interface AccountSelectionRequest {
  accountId: string;
  currency: Currency;
}

export interface AccountSelectionResponse {
  success: boolean;
  message?: string;
  data?: {
    accountId: string;
    currency: Currency;
    accountNumber?: string;
  };
}
