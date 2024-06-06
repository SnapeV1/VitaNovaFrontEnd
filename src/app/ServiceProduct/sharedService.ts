// shared.service.ts
import { Injectable } from '@angular/core';
import { Product } from '../ModelProduct/Product';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
    private baseUrl = 'http://localhost:8081/Product';
    constructor(private http: HttpClient) {}
    editProduct(product: Product): Observable<any> {
    return this.http.put<any>(`/api/products/${product.idPr}`, product);
  }

  updateProduct(productId: number, updatedProduct: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/updateProduct/${productId}`, updatedProduct);
  }
}
