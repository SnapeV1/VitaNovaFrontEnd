import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders } from '@angular/common/http';
import { Notification } from '../Models/Notification';
import { Observable ,throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class NotificationServiceService {
  private baseUrl='http://localhost:8081/Notification';

  constructor(private http: HttpClient) { }

  // Archive a notification
  archiveNotification(id: number): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/archive/${id}`, id);
  }

  // Get all notifications
  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/getNotification`);
  }

  // Get a notification by id
  getNotificationById(id: number): Observable<Notification> {
    return this.http.get<Notification>(`${this.baseUrl}getNotificationById/${id}`);
  }

  // Add a notification
  addNotification(notification: Notification): Observable<Notification> {
    return this.http.post<Notification>(`${this.baseUrl}/addNotification`, notification);
  }
  // Update a notification
  updateNotification(id: number, updatedNotification: Notification): Observable<Notification> {
    return this.http.put<Notification>(`${this.baseUrl}update/${id}`, updatedNotification);
  }

  // Subscribe to a category
  subscribeToCategories(idUser: number, categories: string[]): Observable<string> {
    const url = `${this.baseUrl}/subscribe/${idUser}`;
    return this.http.post<any>(url, categories)
      .pipe(
        catchError((error: any) => {
          let errorMessage = 'Failed to subscribe';
          if (error.error && error.error.error) {
            errorMessage += ': ' + error.error.error;
          }
          return throwError(errorMessage);
        })
      );
  }

  unsubscribeFromCategories(idUser: number): Observable<string> {
    const url = `${this.baseUrl}/unsubscribe/${idUser}`;
    return this.http.post<any>(url, {})
      .pipe(
        catchError((error: any) => {
          let errorMessage = 'Failed to unsubscribe';
          if (error.error && error.error.error) {
            errorMessage += ': ' + error.error.error;
          }
          return throwError(errorMessage);
        })
      );
  }

  getNotificationContentsByCriteria(idUser: number, categories: string[], subscription: boolean): Observable<string[]> {
    const url = `${this.baseUrl}/notifications`;

    // Construct query params
    const params = {
      idUser: idUser.toString(),
      categories: categories.join(','),
      subscription: subscription.toString()
    };

    return this.http.get<string[]>(url, { params });
  }
  triggerGymNotification(): Observable<any> {
    const url = `${this.baseUrl}/gymNotification`;

    return this.http.post<any>(url, {})
      .pipe(
        // Handle error if needed
      );
  }
}