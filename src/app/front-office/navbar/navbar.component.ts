import { Component } from '@angular/core';
import { ERole, UserModule } from 'src/app/Models/user.module';
import { AuthService } from 'src/app/Service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private authService: AuthService) {
    this.getUserInfoFromToken();
   }
  userProfile2: UserModule;
  picture!:string;
  signOut(): void {
    this.authService.logoutAndRedirect();
  }

 


  
  

  ngOnInit(): void {   
  }








 getUserInfoFromToken(): void {
    this.authService.getUserInfoFromToken().subscribe(
      (response: UserModule) => {
        this.userProfile2 = response;
        this.picture=this.userProfile2.picture;
        if (this.userProfile2) {
          if(this.userProfile2.role==ERole.ROLE_ADMIN){this.signOut();}
          console.log(this.userProfile2)
           } else {
       
           }
      },
      error => {
        console.error('Error fetching user information:', error);
      }
    );
  }


}
