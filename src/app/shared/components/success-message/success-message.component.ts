import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-success-message',
  standalone: true,
  templateUrl: './success-message.component.html',
  styleUrl: './success-message.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SuccessMessageComponent {
  @Input() titlePrefix = '';
  @Input() titleHighlight = '';
  @Input() subtitlePrefix = '';
  @Input() subtitleHighlight = '';
  @Input() description = '';
}
