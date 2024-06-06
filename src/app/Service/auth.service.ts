import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginRequest } from '../front-office/user/login/LoginRequest';
import { UserInfoResponse } from '../front-office/user/login/UserInfoResponse';
import { UserModule } from '../Models/user.module';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8081/api'; // Update this with your backend URL

  constructor(private http: HttpClient, private router: Router) {}

  authenticateAndGetToken(authRequest: LoginRequest): Observable<UserInfoResponse> {
    return this.http.post<UserInfoResponse>(`${this.baseUrl}/generateToken`, authRequest);
  }

  getUserInfoFromToken(): Observable<UserModule> {
    const token = sessionStorage.getItem('token');
    console.log(token); // Ensure token is retrieved from sessionStorage

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<UserModule>(`${this.baseUrl}/getuserfromtoken`, { headers, withCredentials: true }).pipe(
      catchError(error => {
        console.error('Error fetching user info from token:', error);
        this.router.navigate(['/login']);
        return throwError(error);
      })
    );
  }
  
  logoutUser(): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
  
    // Clear sessionStorage
    sessionStorage.clear();
    return this.http.get<any>(`${this.baseUrl}/signout`, { headers, withCredentials: true });
  }
  

  logoutAndRedirect(): void {
    this.logoutUser().subscribe(response => {
      console.log('Logout successful!', response);
      this.router.navigate(['/login']); 
    }, error => {
      console.error('Logout failed!', error);
    });
  }



  authenticateAndGetTokenGOOGLE(email: string): Observable<UserInfoResponse> {
    const params = new HttpParams().set('email', email);
    return this.http.post<UserInfoResponse>(`${this.baseUrl}/LoginGoogle`, {}, { params });
  }









  googleSignup(username: string, email: string, password: string, role: string, gender: string, dateOfBirth: string, firstName: string, lastName: string, phone: string, pictureUrl: string) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);
    formData.append('gender', gender);
    formData.append('dateOfBirth', dateOfBirth);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('phone', phone);
    formData.append('picture', pictureUrl);

    return this.http.post(this.baseUrl + '/GoogleSignup', formData);
  }
}
