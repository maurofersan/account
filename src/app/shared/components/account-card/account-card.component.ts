import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Account } from '../../interfaces/account.interfaces';
import { PrefixAssetPipe } from '../../pipes/prefix-asset.pipe';

@Component({
  selector: 'app-account-card',
  standalone: true,
  imports: [PrefixAssetPipe],
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
