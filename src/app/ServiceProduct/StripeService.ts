
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  private baseUrl = 'http://localhost:8081/Payment'; // Replace with your Spring Boot backend URL

  constructor(private http: HttpClient) { }

  /*createCharge(amount: number, currency: string, commandelines: any[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/charge`, { amount, currency, commandelines });
  }

  processCheckout(commandelines: any[]): Observable<string> {
    const url = `${this.baseUrl}/Commandeline/checkout`;
    return this.http.post<string>(url, commandelines).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 404) {
      return throwError('Product not found');
    } else if (error.status === 400) {
      return throwError('Bad request');
    } else {
      return throwError('An error occurred during checkout');
    }
  }*/

 processPayment(paymentData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/charge`, paymentData);
  }
}
