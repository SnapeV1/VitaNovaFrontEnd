import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-success',
  templateUrl: './dialog-success.component.html',
  styleUrls: ['./dialog-success.component.css']
})
export class DialogSuccessComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

}
