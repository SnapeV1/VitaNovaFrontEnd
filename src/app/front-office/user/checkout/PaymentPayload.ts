export interface PaymentPayload {
    amount: number;
    name: string;
    cardNumber: string;
    expDate: string;
    cvc: string;
    stripeToken: string;
  }
  