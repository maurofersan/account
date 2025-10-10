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
}
