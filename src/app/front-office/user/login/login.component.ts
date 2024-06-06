declare var google:any;
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginRequest } from './LoginRequest';
import { AuthService } from 'src/app/Service/auth.service';
import { EmailService } from './../../../Service/email.service';
import { UserService } from 'src/app/Service/user.service';
import { SMSService } from './../../../Service/sms.service';
import { OpenCvService } from 'src/app/Service/open-cv.service';
import { UserModule } from 'src/app/Models/user.module';
import { MiscService } from 'src/app/Service/misc.service';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogVerificationComponent } from '../dialog-verification/dialog-verification.component';
import { DialogSuccessComponent } from '../dialog-success/dialog-success.component';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  authRequest: LoginRequest = {
    username: '',
    password: ''
  };

  
ipadress:string;
  errorMessage!: string;
  verificationCode: string = '';
  generatedCode:string = this.emailService.generateVerificationCode();
  showResetPasswordForm: boolean = false;
  verified:boolean=false;
  email: string = "";
  resetMethod :string="email";
  phoneNumber : string ="";
  newPassword!: string;
  confirmPassword !: string;
  isButtonDisabled: boolean = false;
  countdown: number = 30;
 loginAttempt=true;
loginAttempts:number=0;
user: SocialUser;
userProfile:UserModule;
  constructor(private route: ActivatedRoute ,public dialog: MatDialog ,private http: HttpClient, private miscService:MiscService ,private OpencvService:OpenCvService, private authService: AuthService,private router: Router,private emailService:EmailService,private userService:UserService, private smsService:SMSService) {
   
   }
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
        if (params['verificationLinkClicked'] === 'true') {
            this.openSuccessDialog();
        }
        this.miscService.getWANIPAddress().subscribe(
          ip=>this.ipadress
        )
    });
    

    google.accounts.id.initialize({
      client_id: '437770313790-12a57rcd8k8gmjp3o5enjf394ges5v8t.apps.googleusercontent.com',
      callback: (resp: any)=> this.handleLogin(resp)
    });

    google.accounts.id.renderButton(document.getElementById("google-btn"), {
      theme: 'filled_black',
      size: 'large',
      shape: 'pill',
      width: 350
    })
  }    
  private decodeToken(token: string){
    return JSON.parse(atob(token.split(".")[1]));
  }

  handleLogin(response: any){
    if(response) {
      // Decode the token
      const payLoad = this.decodeToken(response.credential);
      // Store in session
      sessionStorage.setItem("loggedInUser", JSON.stringify(payLoad));
      const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
      console.log("response ", response)
      
      this.userService.checkEmail(loggedInUser.email).pipe(
        switchMap((isEmailVerified: boolean) => {
          if (isEmailVerified) {
            return this.authService.authenticateAndGetTokenGOOGLE(loggedInUser.email);
          } else {
            // Handle the case where email is not verified
            this.router.navigate(["signup"]);
            return throwError('Error: Email is not verified');
          }
        })
      ).subscribe(
        (response: any) => {
          if (response) {
            sessionStorage.setItem("loggedIn", "true");
            sessionStorage.setItem("username", response.username);
            sessionStorage.setItem("email", response.email);
            sessionStorage.setItem("role", response.role);
            sessionStorage.setItem("token", response.token);
            sessionStorage.setItem("role", JSON.stringify(response.role));
            console.log('Login successful!', response);
            if (response.role === 'USER') {
              this.userService.getUserByUsername(response.username).subscribe(
                (user: UserModule) => {
                  if (user.archive === true) {
                    alert("Account is deactivated");
                  } else {
                    this.router.navigate(['vitaNova/profile']);
                  }
                },
                (error) => {
                  console.error('Error fetching user:', error);
                }
              );
            } else if (response.role === "ADMIN") {
              this.router.navigate(['/admin/users']);
            }
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
  }
  

getEmailGoogle(){

  
}





openSuccessDialog(): void {
  const dialogRef = this.dialog.open(DialogSuccessComponent, {
    width: '220px',height:'180px',
    data: { title: "Device verified!", message: 'IpAddress verified ' }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
  });
}


  @HostListener('window:beforeunload', ['$event']) beforeUnloadHander($event: any) { 
    if (this.showResetPasswordForm) 
    { $event.returnValue = 'You will lose your progress. Are you sure you want to leave this page?'; } 
  }
  
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any): void {
    if (this.showResetPasswordForm ) {
      if (!confirm('You will lose your progress. Are you sure you want to leave this page?')) {
        history.pushState(null, document.title, window.location.href);
        event.preventDefault();
      }
    }
  }
  
  getButtonLabel() {
    return this.showResetPasswordForm ? "Password Reset" : "Login";
  }



  onSubmit(): void {
    this.authenticateAndGetToken();
  }
  
  private authenticateAndGetToken(): void {
    this.userService.getUserByUsername(this.authRequest.username)
    .subscribe(
      (user: UserModule) => {
        if(this.loginAttempts>2){
          this.OpencvService.captureAndSaveImage().subscribe(
            () => {
              this.emailService.sendLoginImage(user.email,"LOGIN ALERT","Someone tried to login to your account , if it's not you , please consider resetting your password","");
              console.log('Image captured and saved successfully');
            },
            error => {
              console.error('Error occurred while capturing and saving image:', error);
            }
          );
        }
      },
      (error) => {
        
        console.error("Error fetching user details: ", error);
      }
    ); 
    this.authService.authenticateAndGetToken(this.authRequest)
     .subscribe(response => {
        this.handleAuthenticationResponse(response);
      }, error => {
        this.loginAttempt=false;
this.loginAttempts=this.loginAttempts+1;
console.log(this.loginAttempts);
console.error('Login failed!');
        console.error('Authentication failed:', error);
      });
  }
  
  private handleAuthenticationResponse(response: any): void {
    this.miscService.getWANIPAddress()
     .subscribe(ip => {
        this.checkIpAddress(response, ip);
      }, error => {
        console.error('Failed to get WAN IP address:', error);
      });
  }
  
  private checkIpAddress(response: any, ip: string): void {
    this.miscService.checkIpAddress(this.authRequest.username, ip)
     .subscribe(result => {
        if (result) {
          this.handleSuccessfulLogin(response);
        } else {
          this.handleFailedLogin(response, ip);
        }
      }, error => {
        console.error('Failed to check IP address:', error);
      });
  }
  
  private handleSuccessfulLogin(response: any): void {
    this.storeLoginSession(response);
    this.navigateToProfile(response.role);
  }
  
  private handleFailedLogin(response: any, ip: string): void {
    this.generateAndSendLink(this.authRequest.username, response.email, ip);
    this.openDialog();
  }
  
  private storeLoginSession(response: any): void {
    sessionStorage.setItem("loggedIn", "true");
    sessionStorage.setItem("username", response.username);
    sessionStorage.setItem("email", response.email);
    sessionStorage.setItem("role", response.role);
    sessionStorage.setItem("token", response.token);
    sessionStorage.setItem("role", JSON.stringify(response.role));
  }
  
  private navigateToProfile(role: string): void {
    if (role === 'USER') {
      this.userService.getUserByUsername(this.authRequest.username)
       .subscribe(user => {
          if (user.archive) {
            alert("account is deactivated");
          } else {
            this.router.navigate(['vitaNova/profile']);
          }
        }, error => {
          console.error('Error fetching user:', error);
        });
    } else if (role === 'ADMIN') {
      this.router.navigate(['/admin/users']);
    }
  }
  

  sendVerificationCode() {
    this.isButtonDisabled = true;
    this.startCountdown();
    if(this.resetMethod==='email'){
      this.emailService.sendVerificationCode(this.email,"Password Reset ",this.generatedCode);
    }
    if(this.resetMethod==='phone'){
      this.smsService.sendSMS(this.phoneNumber,this.generatedCode);
    }
  }

  verifyCode(){
    if(this.generatedCode==this.verificationCode){
      this.verified=true;
    }
  }

  savePassword(){
    if(this.newPassword==this.confirmPassword){
      if(this.resetMethod==='email'){
        this.userService.resetPassword(this.email,this.newPassword,"").subscribe(response => {alert("password changed"); location.reload(); }, error => {console.error('error', error);});
      }
    }
    else if(this.resetMethod==='phone'){
      this.userService.resetPasswordPhone(this.phoneNumber,this.newPassword).subscribe(response => {alert("password changed"); location.reload(); }, error => {console.error('error', error);});
    }
  }

  startCountdown() {
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(interval);
        this.countdown = 30;
        this.isButtonDisabled = false;
      }
    }, 1000);
  }

  goback() {
    this.showResetPasswordForm=false;
  }







//****LinkGeneration

generateAndSendLink(username: string, email: string, ip:string) {
  const randomString = this.generateRandomString(40);
  const encryptedUsername = this.miscService.encrypt(username, 'VitaNovaVitaNovaVitaNova');
  const url = `http://localhost:8081/api/AddIpAddress?qcxBb0ipkpAM=${encryptedUsername}&token=${randomString}&ipAdress=${ip}`;
  this.emailService.sendVerificationCode(email, "New IP ADDRESS", "A suspicious login attempt has been detected, if it's you, please click the following link: " + url);
}



private generateRandomString(length: number): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

openDialog(): void {
  const dialogRef = this.dialog.open(DialogVerificationComponent, {
    width: '500px',
    data: { title: 'LOGIN ATTEMPT', message: 'A suspicious login attempt has been detected, Verification link has been sent to your email' }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
  });
}





}
