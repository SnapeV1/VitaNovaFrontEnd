declare var google:any;

import { HttpClient } from '@angular/common/http';
import { Component ,HostListener,NgZone, OnInit} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Service/user.service';
import { MiscService } from 'src/app/Service/misc.service';
import { switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/Service/auth.service';
import { Gender } from 'src/app/Models/user.module';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  username: string ="";
  firstName: string ="";
  lastName: string ="";
  dateOfBirth: Date=new Date();
  email: string ="";
  password: string ="";
  role: string="";
  picture: string ="";
  gender:string="";
  weight:number=0;
  phoneNumber:string="";
  height:number=0;
  selectedFile: File | null = null;
  showVerificationCodeInput: boolean = false;
  verificationCode!: string;
  generatedCode!: string;
  show_verification:boolean=false;
textColor: string = '';
selectedFileDataUrl: string | ArrayBuffer | null = null;

selectedFileName!:string;
passwordConfirm!:string;
registerSection:number=0;



theme:string="dark";
image1:string="http://localhost/cats/giphy2.gif";
image2:string="http://localhost/cats/giphy2.gif";
image3:string="http://localhost/cats/giphy2.gif";

/*ERRORS*/
termsChecked:boolean=false;
phoneError:boolean=false;
emailError:boolean=false;
termsError:boolean=false;
EmailExists:boolean=false;
UsernameExists:boolean=false;
verified:boolean=false;
usernameError:boolean=false;
roleError:boolean=false;
genderError:boolean=false;
DateError:boolean=false;
strengthText: string = '';
captcha:string="";

resolved(captchaResponse:string){
  
  this.captcha=captchaResponse;
  console.log('resolved captcha ' + this.captcha);
  }


@HostListener('window:beforeunload', ['$event']) beforeUnloadHander($event: any) { 
  if (this.registerSection > 0) 
  { $event.returnValue = 'You will lose your progress. Are you sure you want to leave this page?'; } 
}

@HostListener('window:popstate', ['$event'])
onPopState(event: any): void {
  if (this.registerSection > 0) {
    if (!confirm('You will lose your progress. Are you sure you want to leave this page?')) {
      history.pushState(null, document.title, window.location.href);
      event.preventDefault();
    }
  }
}




  constructor(private authService:AuthService,private miscService:MiscService, private http: HttpClient, private sanitizer: DomSanitizer,private fb: FormBuilder,private zone: NgZone,private userService : UserService,private router:Router) {
    this.selectedFileName = this.selectedFile?.name ?? '';
    this.generatedCode=this.generateVerificationCode();
   
  
  }
  ngAfterViewInit(){
    const clientId = '437770313790-12a57rcd8k8gmjp3o5enjf394ges5v8t.apps.googleusercontent.com';
  
  // Initialize Google Accounts
  google.accounts.id.initialize({
    client_id: clientId,
    callback: (resp: any) => this.handleSignup(resp)
  });

  // Render the Google Sign-In button
  const buttonElement = document.getElementById("google-btn-Signup");
  if (buttonElement) {
    google.accounts.id.renderButton(buttonElement, {
      theme: 'filled_black',
      size: 'large',
      shape: 'pill',
      width: 350
    });
  } else {
    console.error("Google Sign-In button element not found.");
  }}
  ngOnInit(): void {
    
  }
  




  handleSignup(response: any){
    if(response) {
      // Decode the token
      const payLoad = this.decodeToken(response.credential);
      // Store in session
      sessionStorage.setItem("loggedInUser", JSON.stringify(payLoad));
      const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
      console.log("response ", response)
      const idToken = response.credential;
    
      this.userService.checkEmail(loggedInUser.email).pipe(
        switchMap((isEmailVerified: boolean) => {
          if (!isEmailVerified) {
this.email=loggedInUser.email;
this.firstName=loggedInUser.family_name;
this.lastName=loggedInUser.given_name;
this.username=loggedInUser.given_name+'_'+loggedInUser.family_name;
this.picture=loggedInUser.picture;
this.verified=true;
this.gender=Gender.MALE;
this.dateOfBirth = new Date('2000-04-06');
this.password=null;
this.phoneNumber="00000000";
console.log(loggedInUser);
console.log("password : ", this.password)
this.authService.googleSignup(this.username, this.email,this.password , 'USER', 'MAN', '2000-04-06', this.firstName, this.lastName, this.phoneNumber, this.picture)
      .subscribe(
        response => {
          alert("REGISTERED!! , password : username")
        this.router.navigate(['login']);
          console.log('Signup successful:', response);
        },
        error => {
          console.error('Signup failed:', error);
        }
      );
  
            return loggedInUser.email;
          } else {
            console.log(loggedInUser.picture);

            alert("The email is already used");

            console.log(loggedInUser);

            return throwError('Error: Email is not verified');
          }
        })
      ).subscribe()
        
                
    

      
  }


  }


 private decodeToken(token: string){
    return JSON.parse(atob(token.split(".")[1]));
  }

  

  async fetchUserProfile(accessToken: string): Promise<any> {
    try {
      const profileInfo = await this.http.get<any>('https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }).toPromise();
  
      return profileInfo;
    } catch (error) {
      throw error;
    }
  }


  async exchangeIdTokenForAccessToken(idToken: string): Promise<string> {
    try {
      const response = await this.http.post<any>('https://oauth2.googleapis.com/token', {
        client_id: '437770313790-12a57rcd8k8gmjp3o5enjf394ges5v8t.apps.googleusercontent.com',
        code: idToken,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:4200', // Same as the one you used for Google Sign-In initialization
      }).toPromise();
      
      return response.access_token;
    } catch (error) {
      throw error;
    }
  }
  














  switchModes(){
  if(this.theme=="dark"){
    this.theme="light";
    this.image1="http://localhost/cats/cat2.gif";
    this.image2="http://localhost/cats/cat3.gif";
    this.image3="http://localhost/cats/cat5.gif";

}
  else {this.theme="dark";
  this.image1="http://localhost/cats/giphy2.gif";
  this.image2="http://localhost/cats/giphy2.gif";
  this.image3="http://localhost/cats/giphy2.gif";

}
  console.log(this.theme);
 }

 ValidateAll() {

  if (this.phoneNumber.length !== 8 || !/^\d+$/.test(this.phoneNumber)) {
    this.phoneError = true;
  } else {
    this.phoneError = false;
  }
  if(this.role==""){this.roleError=true ; }else this.roleError=false;
  if(this.gender==""){this.genderError=true;}else this.genderError=false;

  // Parse the date of birth string into a Date object
  const dateOfBirth = new Date(this.dateOfBirth);

  // Calculate the date 13 years ago from today
  const thirteenYearsAgo = new Date();
  thirteenYearsAgo.setFullYear(thirteenYearsAgo.getFullYear() - 13);


  // Compare the year, month, and day components of the dates
  if (dateOfBirth.getFullYear() > thirteenYearsAgo.getFullYear() ||
      (dateOfBirth.getFullYear() === thirteenYearsAgo.getFullYear() && dateOfBirth.getMonth() > thirteenYearsAgo.getMonth()) ||
      (dateOfBirth.getFullYear() === thirteenYearsAgo.getFullYear() && dateOfBirth.getMonth() === thirteenYearsAgo.getMonth() && dateOfBirth.getDate() > thirteenYearsAgo.getDate())) {
    this.DateError = true;
  } else {
    this.DateError = false;
  }
  
}

  save()
  {
    console.log("save")
   

    

    
    this.ValidateAll()
    console.log("verified " , this.verified)
    console.log("this.validateFields() " , this.validateFields())
    console.log(" lkol " , this.validateEmail(this.email)&&this.DateError==false&&this.genderError==false&&this.roleError==false&&this.phoneError==false)

   
    if (this.validateFields() && this.validateEmail(this.email) && !this.DateError && !this.genderError && !this.roleError && !this.phoneError) {
      // Check if a file is selected
      if (this.selectedFile) {
        // Create FormData object
        const formData = new FormData();
        // Append form fields
        formData.append('username', this.username);
        formData.append('email', this.email);
        formData.append('password', this.password);
        formData.append('role', this.role);
        formData.append('gender', this.gender);
        formData.append('height', String(this.height));
        formData.append('weight', String(this.weight));
        
        // Convert date to ISO string
        const isoDate = new Date(this.dateOfBirth).toISOString();
        formData.append('dateOfBirth', isoDate); 
    console.log(isoDate)
        formData.append('firstName', this.firstName);
        formData.append('lastName', this.lastName);
        formData.append('verified', String(this.verified));
        formData.append('phone', this.phoneNumber);
        
        // Append the selected file
        formData.append('file', this.selectedFile); // Include file name
        
        // Send HTTP POST request
        this.http.post("http://localhost:8081/api/signup", formData).subscribe(
          (resultData: any) => {
            console.log(resultData);
            alert("Registered Successfully");
            this.router.navigate(['/login']);
          },
          (error) => {
            console.error('Error registering user:', error);
            // Handle error if needed
          }
        );
      } else {
        console.error('No file selected.');
        // Handle case where no file is selected
      }
    }}

 verifyEmail() {
    if (this.verificationCode === this.generatedCode) {
      // If the codes match, set verified to true
      this.verified = true;
      console.log('Email verified successfully');
    } else {
      this.verified = false;
      console.log('Verification code does not match');

    }


  }


checkEmail(){
  this.userService.checkEmail(this.email).subscribe((exists: boolean) => {
    if (exists) {
      this.EmailExists=true;
    } else {
      this.EmailExists=false;
    }
  });
  
}
checkUsername(){
  this.userService.checkUsername(this.username).subscribe((exists: boolean) => {
    if (exists) {
      this.UsernameExists=true;
    } else {
      this.UsernameExists=false;
    }
  });
  
}

timerSeconds = 0;


  sendVerificationCode() {
    this.checkEmail();
    this.generatedCode=this.generateVerificationCode();
// Start the timer

    if(!this.EmailExists&&this.validateEmail(this.email)){
      this.emailError=false;
this.showVerificationCodeInput=true;
    // Make HTTP POST request to your backend endpoint
    const apiUrl = 'http://localhost:8081/api/sendEmail';
    const payload = { to: this.email, subject:"verification",text: this.generatedCode };
    this.timerSeconds = 30;
    this.startTimer();

    this.http.post(apiUrl, payload).subscribe(
      (response) => {
        
        console.log('Verification code sent successfully');
        // Handle success (e.g., show a success message to the user)
      },
      (error) => {
        console.error('Error sending verification code:', error);
        // Handle error (e.g., show an error message to the user)
      }
    );}
    else{this.EmailExists=true;}
  }

  startTimer() {
    const timer = setInterval(() => {
      this.timerSeconds--;
  
      if (this.timerSeconds <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  }




  onPasswordChange(): void {
    // Call a function to calculate password strength
    const strength = this.calculatePasswordStrength(this.password);

    // Update the text and text color based on password strength
    if (strength < 3) {
      this.strengthText = 'Weak';
      this.textColor = 'red';
    } else if (strength < 5) {
      this.strengthText = 'Moderate';
  this.textColor='turquoise'
    
    } else {
      this.strengthText = 'Strong';
      this.textColor = 'green';
    }
  }

  calculatePasswordStrength(password: string): number {
    // Implement your logic to calculate password strength
    let strength = 0;
    // Example criteria: length, presence of uppercase letters, lowercase letters, numbers, and special characters
    const length = password.length;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (length >= 8) {
      strength++;
    }
    if (hasUpperCase) {
      strength++;
    }
    if (hasLowerCase) {
      strength++;
    }
    if (hasNumber) {
      strength++;
    }
    if (hasSpecialChar) {
      strength++;
    }

    return strength;
  }






  onFileChanged(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      this.selectedFileName=this.selectedFile.name;
      this.onFileSelected(event);
    }
    console.log(this.selectedFile)
  }

  
  getImageUrl(file: File | null): string {
    if (file) {
      return URL.createObjectURL(file);
    } else {
      return ''; // 
    }
  }
  
  getSelectedFileName(): string | null {
    if (this.selectedFile) {
      return this.selectedFile.name;
    } else {
      return null;
    }
  }
  /*copyFileToXAMPP(): void {
    if (this.selectedFile) {
      console.log("in copyfiletoxamp function " + this.selectedFile);
  
      const formData = new FormData();
      formData.append('file', this.selectedFile);
  
      this.http.post<any>(`http://localhost:8081/api/misc/copyToXampp`, formData).pipe(
        catchError(error => {
          console.error('An error occurred:', error);
          return throwError('Failed to upload file'); // Return a custom error message
        })
      ).subscribe(response => {
        console.log('File uploaded successfully:', response);
        // Handle success if needed
      }, error => {
        console.error('Error uploading file:', error);
        // Handle error if needed
      });
    } else {
      console.log("empty file");
    }
  }*/



  generateVerificationCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let verificationCode = '';
    for (let i = 0; i < 6; i++) {
      verificationCode += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return verificationCode;
  }
  


  validateFields(): boolean {
    

    const areAllFieldsValid = (
        this.firstName &&
        this.lastName &&
        this.username &&
        this.email &&
        this.password &&
        this.role &&
        this.gender &&
        this.dateOfBirth 
    );

    if ((areAllFieldsValid))return true;
    else return false;
}

  validateEmail(email: string): boolean {

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(email).toLowerCase())==true){this.emailError=false; return true;}
    else this.emailError=true;return false ;
  }
  
  validatePassword(password: string): boolean {
    // Add your password validation logic here.
    // You can check if the password meets certain requirements, such as a minimum length or the presence of special characters.
    return password.length >= 8;
  }
  validateUsername() {
    if (this.username && /^[^0-9].*$/.test(this.username.trim())) {
      this.usernameError=false;

      return true;
    } else {
      this.usernameError=true;
      return false;
    }
  }
  

onTermsChange(checked: boolean) {
  this.termsChecked = checked;
}
 next1(){
 this.checkEmail();
this.checkUsername();
this.validateUsername();

if((this.validateEmail(this.email))&&(this.EmailExists==false)&&(this.UsernameExists==false)&&this.verified&&this.termsChecked)this.registerSection=this.registerSection+1;
else
if((this.validateEmail(this.email))&&(this.EmailExists==false)&&(this.UsernameExists==false)&&!this.verified) alert("Email verification is required");
if((this.validateEmail(this.email))&&(this.EmailExists==false)&&(this.UsernameExists==false)&&this.verified&&!this.termsChecked){this.termsError=true;}else this.termsError=false;
}
  

next2(){
 
if(this.firstName!=null&&this.lastName!=null&&this.password!=null&&this.password==this.passwordConfirm&&(this.strengthText=="Moderate"||this.strengthText=="Strong"))this.registerSection=this.registerSection+1;
}




onFileSelected(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    this.selectedFileName = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedFileDataUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

}



