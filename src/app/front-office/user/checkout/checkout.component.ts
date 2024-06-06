import { Component, Inject, ViewChild } from '@angular/core';
import { StripeService, StripeCardNumberComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
  PaymentIntent,
  CreateTokenCardData,
} from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { PaymentPayload } from './PaymentPayload';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/Service/user.service';
import { Plan, UserModule } from 'src/app/Models/user.module';
import { CheckoutDoneComponent } from '../checkout-done/checkout-done.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  elementsOptions: StripeElementsOptions = {
    locale: 'es',
  };

  stripeTest: FormGroup;

  loading = false;
  user: UserModule;

  @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { amount: number },
    private dialog: MatDialog,
    private stripeService: StripeService,
    private http: HttpClient,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userService.getUser().subscribe(user => {
      this.user = user;
    });
    this.createForm();
  }

  createForm() {
    this.stripeTest = this.fb.group({
      name: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expDate: ['', [Validators.required]],
      cvc: ['', Validators.required]
    });
  }

  submitPayment() {
    const expDateValue = this.stripeTest.value.expDate;
    console.log('Expiration date value:', expDateValue);
    this.loading = true;
    const payload: PaymentPayload = {
      amount: this.data.amount, 
      name: this.stripeTest.value.name,
      cardNumber: "4242424242424242",
      expDate: this.stripeTest.value.expDate,
      cvc: this.stripeTest.value.cvc,
      stripeToken: "tok_visa",
    };
    console.log(payload);
    console.log("user: ", this.user);

    // Generate random transaction number
    const transactionNumber = this.generateTransactionNumber();

    // Send the payload to your backend endpoint
    this.http.post('http://localhost:8081/checkout/process-payment', payload)
      .subscribe(
        (response) => {
          // Handle successful response, such as redirecting to a success page
          console.log('Payment processed successfully:', response);
          this.user.plan = Plan.PREMIUM;
          this.userService.updateUser(this.user).subscribe();
          this.dialog.closeAll();

          // Open CheckoutDoneComponent with transaction number
          const dialogRef = this.dialog.open(CheckoutDoneComponent, {
            width: '500px', 
            data: {
              userProfile: this.user,
              transactionNumber: transactionNumber
            }
          });

          dialogRef.afterOpened().subscribe(() => {
            this.userService.setUser(this.user);
            setTimeout(() => {
              dialogRef.close();
            }, 4000);
          });
        },
        (error) => {
          // Handle error
          this.loading = false;
          console.error('Error processing payment:', error);
        }
      );
  }

  generateTransactionNumber(): string {
    // Generate a random 8-digit transaction number
    const min = 10000000;
    const max = 99999999;
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
  }
}
