import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { BaseComponent } from '../../../../shared/base/base.component';
import { TextService } from '../../../../core/services/text.service';
import { AccountStoreService } from '../../../../core/services/account-store.service';
import { AccountApiService } from '../../../../core/services/account-api.service';
import {
  AccountNavigationComponent,
  AccountTitleSectionComponent,
  ContractModalComponent,
} from '../../../../shared/components';
import { StdButtonDirective, AlphanumericOnlyDirective } from '../../../../shared/directives';
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
    ContractModalComponent,
    StdButtonDirective,
    AlphanumericOnlyDirective,
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
  allProvinces: Province[] = []; // Todas las provincias cargadas
  allDistricts: District[] = []; // Todos los distritos cargados

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

          // Si hay datos de ubicación, intentar encontrar los IDs
          if (data.department) {
            const department = this.departments.find(d => d.name === data.department);
            if (department) {
              this.addressData.departmentId = department.id;
              
              // Si hay provincia, buscar su ID
              if (data.province) {
                // Esperar a que las provincias se carguen
                setTimeout(() => {
                  const province = this.allProvinces.find(p => p.name === data.province && p.departmentId === department.id);
                  if (province) {
                    this.addressData.provinceId = province.id;
                    
                    // Si hay distrito, buscar su ID
                    if (data.district) {
                      setTimeout(() => {
                        const district = this.allDistricts.find(d => d.name === data.district && d.provinceId === province.id);
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
  onConsentChange(event: any): void {
    try {
      // Extraer el valor del evento - puede venir en diferentes formatos
      let checked = false;
      
      if (event !== undefined && event !== null) {
        // Si event es un boolean, usarlo directamente
        if (typeof event === 'boolean') {
          checked = event;
        }
        // Si event tiene detail (CustomEvent)
        else if (event.detail !== undefined) {
          // Si detail es un boolean, usarlo
          if (typeof event.detail === 'boolean') {
            checked = event.detail;
          }
          // Si detail es un objeto, intentar extraer checked
          else if (event.detail && typeof event.detail === 'object') {
            checked = event.detail.checked !== undefined ? event.detail.checked : false;
          }
        }
        // Si event tiene target.checked (InputEvent)
        else if (event.target && event.target.checked !== undefined) {
          checked = event.target.checked;
        }
        // Si event es un objeto con checked
        else if (event.checked !== undefined) {
          checked = event.checked;
        }
      }
      
      this.consentAccepted = checked;
    } catch (error) {
      console.warn('Error handling consent change:', error);
    }
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
      // Extraer el valor del evento - puede venir en diferentes formatos
      let value = '';
      
      if (event) {
        // Si event es un string, usarlo directamente
        if (typeof event === 'string') {
          value = event;
        }
        // Si event tiene detail (CustomEvent)
        else if (event.detail !== undefined) {
          // Si detail es un string, usarlo
          if (typeof event.detail === 'string') {
            value = event.detail;
          }
          // Si detail es un objeto, intentar extraer value
          else if (event.detail && typeof event.detail === 'object') {
            value = event.detail.value || event.detail.detail || '';
          }
        }
        // Si event tiene target.value (InputEvent)
        else if (event.target && event.target.value !== undefined) {
          value = event.target.value;
        }
        // Si event es un objeto con value
        else if (event.value !== undefined) {
          value = event.value;
        }
      }
      
      // Asegurarse de que value sea un string
      value = String(value || '');
      
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
  onDeclarationChange(event: any): void {
    try {
      // Extraer el valor del evento - puede venir en diferentes formatos
      let accepted = false;
      
      if (event !== undefined && event !== null) {
        // Si event es un boolean, usarlo directamente
        if (typeof event === 'boolean') {
          accepted = event;
        }
        // Si event tiene detail (CustomEvent)
        else if (event.detail !== undefined) {
          // Si detail es un boolean, usarlo
          if (typeof event.detail === 'boolean') {
            accepted = event.detail;
          }
          // Si detail es un objeto, intentar extraer checked
          else if (event.detail && typeof event.detail === 'object') {
            accepted = event.detail.checked !== undefined ? event.detail.checked : false;
          }
        }
        // Si event tiene target.checked (InputEvent)
        else if (event.target && event.target.checked !== undefined) {
          accepted = event.target.checked;
        }
        // Si event es un objeto con checked
        else if (event.checked !== undefined) {
          accepted = event.checked;
        }
      }
      
      this.declarationAccepted = accepted;
    } catch (error) {
      console.warn('Error handling declaration change:', error);
    }
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
      next: async (departments) => {
        this.departments = departments;
        console.log('Departments loaded:', departments);
        
        // Cargar todas las provincias y distritos después de cargar los departamentos
        await this.loadAllProvinces(departments);
        await this.loadAllDistricts(departments);
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
    
    console.log('Department selected:', department?.name, 'ID:', departmentId);
    console.log('All provinces count:', this.allProvinces.length);
    
    // Reset province and district when department changes
    // Solo si la provincia seleccionada no pertenece al nuevo departamento
    if (this.addressData.provinceId) {
      const currentProvince = this.allProvinces.find(p => p.id === this.addressData.provinceId);
      if (!currentProvince || String(currentProvince.departmentId) !== String(departmentId)) {
        this.addressData.provinceId = '';
        this.addressData.province = '';
        this.addressData.districtId = '';
        this.addressData.district = '';
      }
    } else {
      // Si no hay provincia seleccionada, asegurarse de que estén vacíos
      this.addressData.provinceId = '';
      this.addressData.province = '';
      this.addressData.districtId = '';
      this.addressData.district = '';
    }
    
    // Log filtered provinces for debugging
    const filtered = this.filteredProvinces;
    console.log('Filtered provinces for department', departmentId, ':', filtered.length);
    if (filtered.length > 0) {
      console.log('Sample provinces:', filtered.slice(0, 3).map(p => p.name));
    } else {
      console.warn('No provinces found for department. All provinces:', this.allProvinces.length);
      if (this.allProvinces.length > 0) {
        console.log('Sample province departmentIds:', this.allProvinces.slice(0, 5).map(p => ({ name: p.name, deptId: p.departmentId })));
      }
    }
  }

  /**
   * Loads all provinces
   */
  private async loadAllProvinces(departments: Department[]): Promise<void> {
    try {
      const provincePromises = departments.map(async dept => {
        const provinces = await firstValueFrom(this.accountApi.getProvincesByDepartment(dept.id));
        // Asegurarse de que cada provincia tenga el departmentId correcto
        return provinces.map(province => ({
          ...province,
          departmentId: province.departmentId || dept.id
        }));
      });
      
      const provinceArrays = await Promise.all(provincePromises);
      this.allProvinces = provinceArrays.flat();
      console.log('All provinces loaded:', this.allProvinces.length);
      if (this.allProvinces.length > 0) {
        console.log('Sample province:', {
          name: this.allProvinces[0].name,
          departmentId: this.allProvinces[0].departmentId
        });
      }
    } catch (error) {
      console.warn('Error loading all provinces:', error);
    }
  }

  /**
   * Handles province selection change
   */
  onProvinceChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const provinceId = target.value;
    const province = this.allProvinces.find(p => p.id === provinceId);
    
    this.addressData.provinceId = provinceId;
    this.addressData.province = province?.name || '';
    
    console.log('Province selected:', province?.name, 'ID:', provinceId);
    console.log('All districts count:', this.allDistricts.length);
    
    // Si la provincia seleccionada no pertenece al departamento actual, actualizar el departamento
    if (province && String(province.departmentId) !== String(this.addressData.departmentId)) {
      const department = this.departments.find(d => d.id === province.departmentId);
      if (department) {
        this.addressData.departmentId = province.departmentId;
        this.addressData.department = department.name;
      }
    }
    
    // Reset district when province changes
    // Solo si el distrito seleccionado no pertenece a la nueva provincia
    if (this.addressData.districtId) {
      const currentDistrict = this.allDistricts.find(d => d.id === this.addressData.districtId);
      if (!currentDistrict || String(currentDistrict.provinceId) !== String(provinceId)) {
        this.addressData.districtId = '';
        this.addressData.district = '';
      }
    }
    
    // Log filtered districts for debugging
    const filtered = this.filteredDistricts;
    console.log('Filtered districts for province', provinceId, ':', filtered.length);
    if (filtered.length > 0) {
      console.log('Sample districts:', filtered.slice(0, 3).map(d => d.name));
    } else {
      console.warn('No districts found for province. All districts:', this.allDistricts.length);
      if (this.allDistricts.length > 0) {
        console.log('Sample district provinceIds:', this.allDistricts.slice(0, 5).map(d => ({ name: d.name, provId: d.provinceId })));
      }
    }
  }

  /**
   * Loads all districts
   */
  private async loadAllDistricts(departments: Department[]): Promise<void> {
    try {
      // Primero cargar todas las provincias si aún no están cargadas
      if (this.allProvinces.length === 0) {
        await this.loadAllProvinces(departments);
      }
      
      const districtPromises = this.allProvinces.map(async province => {
        const districts = await firstValueFrom(this.accountApi.getDistrictsByProvince(province.id));
        // Asegurarse de que cada distrito tenga el provinceId correcto
        return districts.map(district => ({
          ...district,
          provinceId: district.provinceId || province.id
        }));
      });
      
      const districtArrays = await Promise.all(districtPromises);
      this.allDistricts = districtArrays.flat();
      console.log('All districts loaded:', this.allDistricts.length);
      if (this.allDistricts.length > 0) {
        console.log('Sample district:', {
          name: this.allDistricts[0].name,
          provinceId: this.allDistricts[0].provinceId
        });
      }
    } catch (error) {
      console.warn('Error loading all districts:', error);
    }
  }

  /**
   * Handles district selection change
   */
  onDistrictChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const districtId = target.value;
    const district = this.allDistricts.find(d => d.id === districtId);
    
    this.addressData.districtId = districtId;
    this.addressData.district = district?.name || '';
    
    // Si el distrito seleccionado no pertenece a la provincia actual, actualizar la provincia
    if (district && district.provinceId !== this.addressData.provinceId) {
      const province = this.allProvinces.find(p => p.id === district.provinceId);
      if (province) {
        this.addressData.provinceId = district.provinceId;
        this.addressData.province = province.name;
        
        // Si la provincia no pertenece al departamento actual, actualizar el departamento
        if (province.departmentId !== this.addressData.departmentId) {
          const department = this.departments.find(d => d.id === province.departmentId);
          if (department) {
            this.addressData.departmentId = province.departmentId;
            this.addressData.department = department.name;
          }
        }
      }
    }
  }

  /**
   * Gets filtered provinces based on selected department
   */
  get filteredProvinces(): Province[] {
    if (!this.addressData.departmentId) {
      return this.allProvinces;
    }
    // Asegurarse de que las provincias estén cargadas antes de filtrar
    if (this.allProvinces.length === 0) {
      return [];
    }
    const filtered = this.allProvinces.filter(p => {
      // Comparación estricta de strings
      return String(p.departmentId) === String(this.addressData.departmentId);
    });
    return filtered;
  }

  /**
   * Gets filtered districts based on selected province
   */
  get filteredDistricts(): District[] {
    // Asegurarse de que los distritos estén cargados antes de filtrar
    if (this.allDistricts.length === 0) {
      return [];
    }
    
    if (!this.addressData.provinceId) {
      // Si no hay provincia seleccionada pero hay departamento, mostrar distritos de provincias del departamento
      if (this.addressData.departmentId) {
        const departmentProvinces = this.allProvinces.filter(p => 
          String(p.departmentId) === String(this.addressData.departmentId)
        );
        const departmentProvinceIds = departmentProvinces.map(p => p.id);
        const filtered = this.allDistricts.filter(d => 
          departmentProvinceIds.some(pid => String(d.provinceId) === String(pid))
        );
        return filtered;
      }
      return this.allDistricts;
    }
    
    const filtered = this.allDistricts.filter(d => 
      String(d.provinceId) === String(this.addressData.provinceId)
    );
    return filtered;
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
