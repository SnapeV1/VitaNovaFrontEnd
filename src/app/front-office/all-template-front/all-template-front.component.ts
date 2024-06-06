import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserModule } from 'src/app/Models/user.module';
import { AuthService } from 'src/app/Service/auth.service';

@Component({
  selector: 'app-all-template-front',
  templateUrl: './all-template-front.component.html',
  styleUrls: ['./all-template-front.component.css']
})

export class AllTemplateFrontComponent {
  userProfile: UserModule;

  constructor(private authService: AuthService ,private http: HttpClient) {

    this.userProfile = new UserModule(); 
  }

  ngOnInit(): void {
    this.getUserInfoFromToken();
  }









  getUserInfoFromToken(): void {
    this.authService.getUserInfoFromToken().subscribe(
      (response: UserModule) => {
        this.userProfile = response;
      },
      error => {
        console.error('Error fetching user information:', error);
      }
    );
  }
}
