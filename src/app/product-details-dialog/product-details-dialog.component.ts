import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MiscService } from '../Service/misc.service';

@Component({
  selector: 'app-product-details-dialog',
  templateUrl: './product-details-dialog.component.html',
  styleUrls: ['./product-details-dialog.component.css']
})
export class ProductDetailsDialogComponent {

  imageUrl: string;
  boycot:boolean;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private miscService:MiscService) {

    this.miscService.searchImage(data.productDetails.dishes[0].name).subscribe(
        response => {
          console.log("response : ", response);
          const imageUrl = response.url;
          console.log("Image URL:", imageUrl);
          this.imageUrl = imageUrl;
          console.log(this.imageUrl);})

    this.boycot=data.boycote;
    console.log("in dialog: ",this.data.boycote)
    console.log("data : ",data)
  }




}
