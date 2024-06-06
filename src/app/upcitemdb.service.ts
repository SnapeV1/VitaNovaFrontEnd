import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpcitemdbService {
  private apiUrl = 'https://api.upcitemdb.com/prod/trial/lookup';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  getProductDetails(barcode: string): Observable<any> {
    const body = { upc: barcode };
    return this.http.post(this.apiUrl, body, { headers: this.headers });
  }
}
