import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-checkout-done',
  templateUrl: './checkout-done.component.html',
  styleUrls: ['./checkout-done.component.css']
})
export class CheckoutDoneComponent {


  constructor( @Inject(MAT_DIALOG_DATA) public data:any){

  }

transactionId:number=this.data.transactionNumber;



}
