import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.css']
})
export class InfoCardComponent {
  @Input() cardTitle: string = ''; // Title for the card
  @Input() customClass: string = ''; // For any additional user-defined classes

  constructor() { }
}
