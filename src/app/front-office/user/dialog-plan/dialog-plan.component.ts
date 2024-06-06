import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { loadStripe } from '@stripe/stripe-js';
import { StripeService } from 'ngx-stripe';
import { Observable, switchMap } from 'rxjs';
import { CheckoutComponent } from '../checkout/checkout.component';
import { UserModule } from 'src/app/Models/user.module';
import { UserService } from 'src/app/Service/user.service';
@Component({
  selector: 'app-dialog-plan',
  templateUrl: './dialog-plan.component.html',
  styleUrls: ['./dialog-plan.component.css']
})

export class DialogPlanComponent implements OnInit {
  showPaymentForm: boolean = false;
  stripe: any;
  card: any;
  stripeKey: string;
amount:number;
  private configUrl = 'assets/configAmine.json';
  priceId: string;
user:UserModule;
  constructor( private userService: UserService,private dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient,private stripeService: StripeService
) { }

togglePaymentForm(amount: number) {
  this.showPaymentForm = !this.showPaymentForm;
  if (this.showPaymentForm) {
    this.dialog.closeAll();
    this.user = this.data.userProfile;
    console.log(this.user)
    const dialogRef = this.dialog.open(CheckoutComponent, {
      width: '500px', 
      panelClass: 'custom-dialog-container', 

      data: { amount: amount, userProfile: this.user }
    });

    dialogRef.afterOpened().subscribe(() => {
      this.userService.setUser(this.data.userProfile);
    });
  }
}


  ngOnInit(): void {
    this.getkey();

  }




  
  getConfig(): Observable<any> {
    return this.http.get<any>(this.configUrl);
  }

  getkey() {
    this.getConfig().subscribe(config => {
      this.stripeKey = config.stripeKey;
      console.log("key : ", this.stripeKey); // This will log the correct key
    });
  }
}
