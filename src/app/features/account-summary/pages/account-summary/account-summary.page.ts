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
  DeclarationCheckboxComponent,
  ContractModalComponent,
} from '../../../../shared/components';
import { StdButtonDirective } from '../../../../shared/directives';
import {
  RedisCreateResponse,
  Department,
  Province,
  District,
} from '../../../../shared/interfaces/account.interfaces';

@Component({
  selector: 'app-account-summary-page',
  standalone: true,
  imports: [
    FormsModule,
    AccountNavigationComponent,
    AccountTitleSectionComponent,
    ConsentCheckboxComponent,
    DeclarationCheckboxComponent,
    ContractModalComponent,
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
    department: '',
    departmentId: '',
    province: '',
    provinceId: '',
    district: '',
    districtId: '',
  };

  // Location data
  departments: Department[] = [];
  provinces: Province[] = [];
  districts: District[] = [];

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
  declarationAccepted = false;
  isContractModalOpen = false;

  private textService = inject(TextService);
  private accountStore = inject(AccountStoreService);
  private accountApi = inject(AccountApiService);
  private router = inject(Router);

  ngOnInit(): void {
    this.textService.loadTexts('es').subscribe({
      error: (error) => {
        console.warn('Error loading texts, using defaults:', error);
      }
    });
    this.loadAccountData();
    this.loadDepartments();
  }

  /**
   * Loads account and user data from the fake backend
   */
  private loadAccountData(): void {
    // Obtener productId y documentNumber
    // Puedes obtenerlos de localStorage, route params, o usar valores por defecto
    const productId = this.getProductId();
    const documentNumber = this.getDocumentNumber();

    if (productId && documentNumber) {
      this.accountApi.getAccountAndUserData(productId, documentNumber).subscribe({
        next: (data: RedisCreateResponse) => {
          console.log('Datos obtenidos del backend:', data);
          
          // Mapear datos personales
          this.personalData = {
            fullName: data.fullName || this.personalData.fullName,
            dni: data.documentNumber || this.personalData.dni,
            birthDate: this.formatBirthDate(data.birthDate) || this.personalData.birthDate,
            maritalStatus: data.maritalStatus || '',
            gender: data.gender || '',
          };

          // Mapear datos de contacto
          this.contactData = {
            mobile: this.formatPhoneNumber(data.phoneNumber) || this.contactData.mobile,
            email: data.email || this.contactData.email,
          };

          // Mapear datos de cuenta
          this.newAccountData = {
            type: data.accountTypeName || this.newAccountData.type,
            currency: this.getCurrencyName(data.currency) || this.newAccountData.currency,
          };

          // Mapear datos de dirección
          this.addressData = {
            ...this.addressData,
            department: data.department || '',
            province: data.province || '',
            district: data.district || '',
          };

          // Si hay datos de ubicación, intentar encontrar los IDs y cargar provincias/distritos
          if (data.department) {
            const department = this.departments.find(d => d.name === data.department);
            if (department) {
              this.addressData.departmentId = department.id;
              this.loadProvinces(department.id);
              
              // Si hay provincia, buscar su ID y cargar distritos
              if (data.province) {
                // Esperar a que las provincias se carguen
                setTimeout(() => {
                  const province = this.provinces.find(p => p.name === data.province);
                  if (province) {
                    this.addressData.provinceId = province.id;
                    this.loadDistricts(province.id);
                    
                    // Si hay distrito, buscar su ID
                    if (data.district) {
                      setTimeout(() => {
                        const district = this.districts.find(d => d.name === data.district);
                        if (district) {
                          this.addressData.districtId = district.id;
                        }
                      }, 300);
                    }
                  }
                }, 300);
              }
            }
          }
        },
        error: (error) => {
          console.warn('Error obteniendo datos del backend (usando valores por defecto):', error);
          // Mantener valores por defecto si hay error - esto es normal si el backend no está disponible
        }
      });
    }
  }

  /**
   * Gets productId from localStorage or uses default
   */
  private getProductId(): string {
    // Intentar obtener desde localStorage
    const productId = localStorage.getItem('productId');
    if (productId) {
      return productId;
    }
    
    // Valor por defecto del ejemplo
    return '0ed651ca-908b-4f83-9626-d6b4740d97e7';
  }

  /**
   * Gets documentNumber from localStorage or uses default
   */
  private getDocumentNumber(): string {
    // Intentar obtener desde localStorage del onboarding
    try {
      const onboardingData = localStorage.getItem('onboardingData');
      if (onboardingData) {
        const data = JSON.parse(onboardingData);
        if (data.documentNumber) {
          return data.documentNumber;
        }
      }
    } catch (error) {
      console.error('Error reading documentNumber from onboardingData:', error);
    }

    // Intentar desde localStorage directo
    const documentNumber = localStorage.getItem('documentNumber');
    if (documentNumber) {
      return documentNumber;
    }

    // Valor por defecto del ejemplo
    return '70223123';
  }

  /**
   * Formats birth date from YYYY-MM-DD to DD/MM/YYYY
   */
  private formatBirthDate(date: string | undefined): string {
    if (!date) return '';
    
    try {
      const dateObj = new Date(date);
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return date; // Retornar el formato original si hay error
    }
  }

  /**
   * Formats phone number with spaces
   */
  private formatPhoneNumber(phone: string | undefined): string {
    if (!phone) return '';
    
    // Remover espacios y caracteres no numéricos
    const cleaned = phone.replace(/\D/g, '');
    
    // Formatear como XXX XXX XXX
    if (cleaned.length === 9) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }
    
    return phone; // Retornar original si no tiene 9 dígitos
  }

  /**
   * Converts currency ID or code to currency name
   */
  private getCurrencyName(currency: string | undefined): string {
    if (!currency) return 'Soles';

    // Si es un código como 'PEN' o 'USD'
    if (currency === 'PEN' || currency.toUpperCase() === 'PEN') {
      return 'Soles';
    }
    if (currency === 'USD' || currency.toUpperCase() === 'USD') {
      return 'Dólares';
    }

    // Si es un ID UUID, mapear
    const currencyMap: { [key: string]: string } = {
      'b0006e00-8d7d-4395-af9f-a965eefe1b4b': 'Soles',
      // Agregar más mapeos según necesites
    };

    return currencyMap[currency] || 'Soles';
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
    try {
      const value = event?.detail || event?.target?.value || event || '';
      this.addressData.roadName = value;
      this.validateRoadName();
    } catch (error) {
      console.warn('Error handling road name change:', error);
    }
  }

  /**
   * Handles road number change event from std-input
   */
  onRoadNumberChange(event: any): void {
    try {
      const value = event?.detail || event?.target?.value || event || '';
      this.addressData.roadNumber = value;
      this.validateRoadNumber();
    } catch (error) {
      console.warn('Error handling road number change:', error);
    }
  }

  /**
   * Validates road name field
   */
  validateRoadName(): void {
    const roadName = this.addressData?.roadName || '';
    this.roadNameError = roadName.length < 2;
  }

  /**
   * Validates road number field
   */
  validateRoadNumber(): void {
    const roadNumber = this.addressData?.roadNumber || '';
    this.roadNumberError = roadNumber.length < 2;
  }

  /**
   * Handles declaration checkbox change
   */
  onDeclarationChange(accepted: boolean): void {
    this.declarationAccepted = accepted;
  }

  /**
   * Opens contract modal
   */
  onOpenContract(): void {
    this.isContractModalOpen = true;
  }

  /**
   * Closes contract modal
   */
  onCloseContract(): void {
    this.isContractModalOpen = false;
  }

  /**
   * Handles contract agreement
   */
  onContractAgree(): void {
    this.consentAccepted = true;
    this.isContractModalOpen = false;
  }

  /**
   * Loads all departments
   */
  private loadDepartments(): void {
    this.accountApi.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
        console.log('Departments loaded:', departments);
      },
      error: (error) => {
        console.warn('Error loading departments:', error);
      }
    });
  }

  /**
   * Handles department selection change
   */
  onDepartmentChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const departmentId = target.value;
    const department = this.departments.find(d => d.id === departmentId);
    
    this.addressData.departmentId = departmentId;
    this.addressData.department = department?.name || '';
    
    // Reset province and district when department changes
    this.addressData.provinceId = '';
    this.addressData.province = '';
    this.addressData.districtId = '';
    this.addressData.district = '';
    this.provinces = [];
    this.districts = [];
    
    // Load provinces for selected department
    if (departmentId) {
      this.loadProvinces(departmentId);
    }
  }

  /**
   * Loads provinces by department ID
   */
  private loadProvinces(departmentId: string): void {
    this.accountApi.getProvincesByDepartment(departmentId).subscribe({
      next: (provinces) => {
        this.provinces = provinces;
        console.log('Provinces loaded:', provinces);
      },
      error: (error) => {
        console.warn('Error loading provinces:', error);
      }
    });
  }

  /**
   * Handles province selection change
   */
  onProvinceChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const provinceId = target.value;
    const province = this.provinces.find(p => p.id === provinceId);
    
    this.addressData.provinceId = provinceId;
    this.addressData.province = province?.name || '';
    
    // Reset district when province changes
    this.addressData.districtId = '';
    this.addressData.district = '';
    this.districts = [];
    
    // Load districts for selected province
    if (provinceId) {
      this.loadDistricts(provinceId);
    }
  }

  /**
   * Loads districts by province ID
   */
  private loadDistricts(provinceId: string): void {
    this.accountApi.getDistrictsByProvince(provinceId).subscribe({
      next: (districts) => {
        this.districts = districts;
        console.log('Districts loaded:', districts);
      },
      error: (error) => {
        console.warn('Error loading districts:', error);
      }
    });
  }

  /**
   * Handles district selection change
   */
  onDistrictChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const districtId = target.value;
    const district = this.districts.find(d => d.id === districtId);
    
    this.addressData.districtId = districtId;
    this.addressData.district = district?.name || '';
  }

  /**
   * Checks if continue button should be enabled
   */
  get canContinue(): boolean {
    try {
      return (
        this.consentAccepted &&
        this.declarationAccepted &&
        !this.roadNameError &&
        !this.roadNumberError
      );
    } catch (error) {
      console.warn('Error checking canContinue:', error);
      return false;
    }
  }
}
