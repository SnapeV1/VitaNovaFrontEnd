import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Stripe, StripeElements, StripeCardElement, StripeCardExpiryElement, StripeCardCvcElement } from '@stripe/stripe-js';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.css']
})
export class StripeComponent implements OnInit {
  stripe!: Stripe;
  elements!: StripeElements;
  card!: StripeCardElement;
  cardExpiry!: StripeCardExpiryElement;
  cardCvc!: StripeCardCvcElement;
cvv!: string;
cardNumber!: string;
expDate!: string;
  constructor(private http: HttpClient,@Inject(MAT_DIALOG_DATA) public data: any) {}
  private baseUrl = 'http://localhost:8082'; // Replace with your Spring Boot backend URL
totalPrice!:  number;
  ngOnInit(): void {
    this.stripe = (window as any).Stripe('ta-clé-publique-stripe'); // Remplace par ta clé publique Stripe
    this.elements = this.stripe.elements();
    this.card = this.elements.create('card');
    this.cardExpiry = this.elements.create('cardExpiry');
    this.cardCvc = this.elements.create('cardCvc');
    this.card.mount('#card-element');
    this.cardExpiry.mount('#card-expiry');
    this.cardCvc.mount('#card-cvc');
    this.totalPrice = this.data.totalPrice; // Access the total price passed from the parent component

  }

  async processPayment() {
    const { token } = await this.stripe.createToken(this.card);
}

submitPayment(currency:string, token:string) {
  // Construct the payload with token only
  const payload  = {
    token: token
  };

  // Send the payload along with amount and currency as parameters to your backend endpoint
  this.http.post(`http://localhost:8082/charge?amount=${this.data.totalPrice}&currency=${currency}`, payload)
    .subscribe(
      (response) => {
        // Handle successful response, such as redirecting to a success page
        console.log('Payment processed successfully:', response);
      },
      (error) => {
        // Handle error
        console.log(this.data.totalPrice)
        console.error('Error processing payment:', error);
      }
    );
}

}
