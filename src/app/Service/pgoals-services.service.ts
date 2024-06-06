import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { UserModule } from '../Models/user.module';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PersonalGoalsModule } from '../Models/personal-goals.module';

@Injectable({
  providedIn: 'root'
})
export class PgoalsServicesService {

  constructor(private http: HttpClient) { }

  private baseAdminUrl: string = 'http://localhost:8081/api/goals/all';



  getAll(): Observable<PersonalGoalsModule[]> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<PersonalGoalsModule[]>(`${this.baseAdminUrl}`,{ headers, withCredentials: true });

  }




  updatePgoal(personalG:PersonalGoalsModule){
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log(headers)
    return this.http.put<PersonalGoalsModule>(`http://localhost:8081/api/goals/UpdateGoal`, personalG, { headers, withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Error updating personalG:', error);
          // You can handle error here, such as showing an error message
          return throwError(error);
        })
      );

  }



  DeletePgoal(user:UserModule){
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log(headers)
    return this.http.put<UserModule>(`http://localhost:8081/api/user/admin/DeleteGoal`, user, { headers, withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Error deleting the goal:', error);
          // You can handle error here, such as showing an error message
          return throwError(error);
        })
      );

  }



}
