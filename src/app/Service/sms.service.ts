import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SMSService {

  constructor(private http: HttpClient) { }



  
  private baseUrl: string = 'http://localhost:8081/api/sendSMS';



  sendSMS(phone:string,code:string) {
   
    // Make HTTP POST request to your backend endpoint
    const payload = { to: phone, subject:" ",text: code };

    this.http.post(this.baseUrl, payload).subscribe(
      (response) => {
        console.log('SMS sent successfully');
        // Handle success (e.g., show a success message to the user)
      }
    );
  }
}
