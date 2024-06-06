import { Component, OnInit } from '@angular/core';
import { ProductService } from '../ServiceProduct/product.service';
import { AuthService } from '../Service/auth.service';
import { UserModule } from '../Models/user.module';

@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.css']
})
export class FactureComponent implements OnInit  {
  invoiceData: any;
  userId:number ;
  user: UserModule;
  constructor(private productService: ProductService ,private authService: AuthService ) { }

  ngOnInit(): void {
    this.getUserInfoFromToken();
  }

  getUserInfoFromToken(): void {
    this.authService.getUserInfoFromToken().subscribe(
      (response: UserModule) => {
      this.user = response;
      this.userId=this.user.idUser;
      this.getInvoiceDetails();

      console.log('id user : ' , this.user.idUser);

    }
    );

      }

  getInvoiceDetails() {
   
    this.productService.getInvoiceDetails(this.userId).subscribe(
      (data: any) => {
        this.invoiceData = data;
      },
      error => {
        console.error(error);
        // Gérer les erreurs
      }
    );
  }
}
