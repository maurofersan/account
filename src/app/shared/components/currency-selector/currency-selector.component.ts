import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Currency } from '../../interfaces/account.interfaces';

@Component({
  selector: 'app-currency-selector',
  standalone: true,
  imports: [],
  templateUrl: './currency-selector.component.html',
  styleUrl: './currency-selector.component.scss',
})
export class CurrencySelectorComponent {
  @Input() currencies: Currency[] = [];
  @Input() selectedCurrency: Currency | null = null;
  @Output() currencyChange = new EventEmitter<Currency>();

  onCurrencySelect(currency: Currency): void {
    this.currencyChange.emit(currency);
  }
}
