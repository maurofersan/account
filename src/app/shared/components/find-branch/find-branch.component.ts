import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-find-branch',
  standalone: true,
  templateUrl: './find-branch.component.html',
  styleUrl: './find-branch.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FindBranchComponent {
  @Input() buttonText = '';
  @Input() disabled = false;
  @Output() findBranchClick = new EventEmitter<void>();

  onFindBranchClick(): void {
    if (!this.disabled) {
      this.findBranchClick.emit();
    }
  }
}
