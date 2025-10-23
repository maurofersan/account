import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Account } from '../../interfaces/account.interfaces';

@Component({
  selector: 'app-account-card',
  standalone: true,
  imports: [],
  templateUrl: './account-card.component.html',
  styleUrl: './account-card.component.scss',
})
export class AccountCardComponent {
  @Input() account: Account | null = null;
  @Input() isSelected: boolean = false;
  @Output() selectAccount = new EventEmitter<Account>();

  onSelectAccount(): void {
    if (this.account) {
      this.selectAccount.emit(this.account);
    }
  }

  getFirstWord(text?: string | null): string {
    if (!text) return '';
    const [first, ...rest] = text.split(' ');
    return first ?? '';
  }

  getRestWords(text?: string | null): string {
    if (!text) return '';
    const [first, ...rest] = text.split(' ');
    return rest.join(' ');
  }

  getFeatureIcon(featureText: string): string {
    // Iconos específicos según el contenido del texto
    if (featureText.includes('Dispón de tu dinero')) {
      return '💰'; // Icono de dinero y mano
    }
    if (featureText.includes('costo de mantenimiento')) {
      return '💳'; // Icono de tarjeta/cartera
    }
    if (featureText.includes('monto mínimo')) {
      return '❤️'; // Icono de corazón
    }
    if (featureText.includes('Operaciones ilimitadas')) {
      return '📱'; // Icono de smartphone
    }
    if (featureText.includes('Gana intereses')) {
      return '📈'; // Icono de gráfico de crecimiento
    }
    // Icono por defecto
    return '✓';
  }

  getInfoBoxClass(): string {
    if (!this.account) return '';
    
    // Clase basada en el tipo de cuenta
    if (this.account.type === 'Cuenta Imparable') {
      return 'account-card__image__info-box--teal';
    } else if (this.account.type === 'Cuenta Libre') {
      return 'account-card__image__info-box--yellow';
    }
    
    return '';
  }

  getInfoBoxContent(): string {
    if (!this.account) return '';
    
    // Contenido basado en el tipo de cuenta
    if (this.account.type === 'Cuenta Imparable') {
      return 'Gana\n4.6% en soles\nDesde S/500\n2.5% en dólares';
    } else if (this.account.type === 'Cuenta Libre') {
      return 'S/0\nCosto de\nmantenimiento';
    }
    
    return '';
  }
}
