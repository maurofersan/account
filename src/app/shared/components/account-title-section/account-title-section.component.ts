import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-account-title-section',
  standalone: true,
  imports: [],
  templateUrl: './account-title-section.component.html',
  styleUrl: './account-title-section.component.scss',
})
export class AccountTitleSectionComponent {
  @Input() titlePrefix: string = '';
  @Input() titleHighlight: string = '';
  @Input() subtitle: string = '';
}
