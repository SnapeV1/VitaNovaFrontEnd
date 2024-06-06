import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-verification',
  templateUrl: './dialog-verification.component.html',
  styleUrls: ['./dialog-verification.component.css']
})
export class DialogVerificationComponent {
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

}
