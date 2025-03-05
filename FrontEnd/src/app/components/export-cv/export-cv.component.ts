import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-export-cv',
  templateUrl: './export-cv.component.html',
  styleUrls: ['./export-cv.component.css']
})
export class ExportCvComponent {
  constructor(private dialogRef: MatDialogRef<ExportCvComponent>) {}

  selectTemplate(template: string): void {
    this.dialogRef.close(template); // Close the dialog and return the selected template
  }
  closeDialog(): void {
    this.dialogRef.close(); // Close the dialog without returning any data
  }

}
