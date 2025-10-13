import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Currency } from '../../interfaces/account.interfaces';
import { StdButtonDirective } from '../../directives';

@Component({
  selector: 'app-currency-selector',
  standalone: true,
  imports: [StdButtonDirective],
  templateUrl: './currency-selector.component.html',
  styleUrl: './currency-selector.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CurrencySelectorComponent {
  @Input() currencies: Currency[] = [];
  @Input() selectedCurrency: Currency | null = null;
  @Output() currencyChange = new EventEmitter<Currency>();

  onCurrencySelect(currency: Currency): void {
    this.currencyChange.emit(currency);
  }
}
