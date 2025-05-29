import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-warning-banner',
  templateUrl: './warning-banner.component.html',
  styleUrls: ['./warning-banner.component.css']
})
export class WarningBannerComponent {
  @Input() customClass: string = ''; // For any additional user-defined classes
  // In the future, could add @Input() type: 'warning' | 'info' | 'error' = 'warning';

  constructor() { }
}
