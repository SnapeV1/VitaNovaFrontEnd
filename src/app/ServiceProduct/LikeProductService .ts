import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LikeProductService {

  private apiUrl = 'http://localhost:8081/LikeProduct/addLike';

  constructor(private http: HttpClient) { }

  addLike(userId: number, productId: number): Observable<any> {
    const params = { idUser: userId.toString(), idPr: productId.toString() };
    return this.http.post<any>(this.apiUrl, params);
  }
}
