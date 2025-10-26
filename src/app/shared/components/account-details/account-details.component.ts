import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

export interface AccountDetailsData {
  type: string;
  currency: string;
}

@Component({
  selector: 'app-account-details',
  standalone: true,
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccountDetailsComponent {
  @Input() title = '';
  @Input() typeLabel = '';
  @Input() currencyLabel = '';
  @Input() infoMessagePrefix = '';
  @Input() infoMessageHighlight = '';
  @Input() accountData: AccountDetailsData = { type: '', currency: '' };
}
