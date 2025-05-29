import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.css']
})
export class CustomButtonComponent {
  @Input() type: 'primary' | 'secondary' | 'danger' | 'success' | 'link' | 'add' | 'edit' | 'delete' | 'default' = 'default';
  @Input() disabled: boolean = false;
  @Input() customClass: string = ''; // For additional custom classes
  @Input() title: string = ''; // For aria-label or title attribute

  @Output() buttonClick = new EventEmitter<MouseEvent>();

  get computedButtonClasses(): string[] {
    const classes = ['custom-button'];

    // Base type classes (maps to CSS)
    classes.push(`btn-${this.type}`);

    if (this.customClass) {
      classes.push(this.customClass);
    }
    return classes;
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled) {
      this.buttonClick.emit(event);
    }
  }
}
