import { Component } from '@angular/core';
import { ERole, UserModule } from 'src/app/Models/user.module';
import { AuthService } from 'src/app/Service/auth.service';

@Component({
  selector: 'app-nav-bar-back',
  templateUrl: './nav-bar-back.component.html',
  styleUrls: ['./nav-bar-back.component.css']
})
export class NavBarBackComponent {

  constructor(private authService: AuthService) { 
    this.getUserInfoFromToken();

  }
  userProfile2: UserModule;
  picture!:string;


  signOut(): void {
    this.authService.logoutAndRedirect();
  }



  getUserInfoFromToken(): void {
    this.authService.getUserInfoFromToken().subscribe(
      (response: UserModule) => {
        this.userProfile2 = response;
        this.picture=this.userProfile2.picture;
if(this.userProfile2.role!=ERole.ROLE_ADMIN){this.signOut();}
      },
      error => {
        console.error('Error fetching user information:', error);
      }
    );
  }

}
