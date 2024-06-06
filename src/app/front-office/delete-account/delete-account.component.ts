import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { UserService } from 'src/app/Service/user.service';
import { LoginComponent } from '../user/login/login.component';
import { AuthService } from 'src/app/Service/auth.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private authservice:AuthService,private userService: UserService,private dialog: MatDialog,private http: HttpClient) { }






  async deleteUser(): Promise<void> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });

    const url = `http://localhost:8081/api/user/DeleteUser/${this.data.userProfile.idUser}`;

    try {
        await this.http.delete(url, { headers, withCredentials: true }).toPromise();
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
    this.closeDialog();
    this.authservice.logoutAndRedirect();
}

closeDialog(){
  this.dialog.closeAll()
}

}
