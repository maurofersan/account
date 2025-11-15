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

// Redis Service Interfaces
export interface RedisCreateRequest {
  documentType: string;
  documentNumber: string;
  phoneNumber: string;
  email: string;
  isPeruvian: string;
  acceptedPrivacyPolicy: string;
  productId: string;
  productName: string;
  accountTypeId: string;
  accountTypeName: string;
  statusValotp: string;
  currency: string;
}

export interface LeadProductRecord {
  leadId: number;
  productCode: string;
  subproductCode: string;
  evaluationType: string;
  strategyColorCode: string;
  approvedAmount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface LoanLeadRecord {
  loanId: number;
  leadId: number;
  approvedAmount: number;
  disbursedAmount: number;
  interestRate: number;
  termMonths: number;
  startDate: string;
  endDate: string;
  loanStatus: string;
  contractPath: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
}

export interface RedisCreateResponse {
  leadId: number;
  documentType: string;
  documentNumber: string;
  firstLastname: string;
  secondLastname: string;
  fullName: string;
  birthDate: string;
  phoneNumber: string;
  email?: string;
  maritalStatus: string;
  gender: string;
  homeAddress: string;
  department?: string;
  province?: string;
  district?: string;
  companyRuc: string;
  companyName: string;
  companyPhone: string;
  companyAddress: string;
  campaignStartDate: string;
  income: number;
  bureauScore: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
  leadProductRecord?: LeadProductRecord;
  loanLeadRecord?: LoanLeadRecord;
  accountTypeName?: string;
  currency?: string;
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

export interface Department {
  id: string;
  name: string;
}

export interface Province {
  id: string;
  name: string;
  departmentId: string;
}

export interface District {
  id: string;
  name: string;
  provinceId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

export interface DescribeCatalogItem {
  describeCatalogId: string;
  describeCatalogCode: string;
  describeCatalogDescription: string;
}
