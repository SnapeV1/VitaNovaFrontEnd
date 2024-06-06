import { Component } from '@angular/core';
import { UserService } from 'src/app/Service/user.service';
import { UserModule } from 'src/app/Models/user.module';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-users-back',
  templateUrl: './users-back.component.html',
  styleUrls: ['./users-back.component.css']
})
export class UsersBackComponent {
  users: UserModule[]= [];
  searchQuery: string = ''; // Store the search query
  filteredUsers: UserModule[] = []; // Store the filtered users
  roles: string[] = ['ADMIN', 'USER']; // Define your roles here
  selectedRole: string = ''; // Variable to hold the selected role

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      (users: UserModule[]) => {
        this.users = users;
        this.filteredUsers = [...this.users];

      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(
      () => {
        // Assuming you want to refresh the user list after deleting a user
        this.userService.getUsers().subscribe(
          (users: UserModule[]) => {
            this.users = users;
          },
          (error) => {
            console.error('Error fetching users:', error);
          }
        );
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    );
  }


  ActivateUser(id: number): void {
    this.userService.ActivateUser(id).subscribe(
      () => {
        // Assuming you want to refresh the user list after deleting a user
        this.userService.getUsers().subscribe(
          (users: UserModule[]) => {
            this.users = users;
          },
          (error) => {
            console.error('Error fetching users:', error);
          }
        );
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    );
  }
  updateUserProperty(event: any, user: UserModule, property: string) {
   
      // Get the new value from the input field
      let newValue = event.target.textContent.trim();
  
      // Check if the property exists in the user object
      if (user.hasOwnProperty(property)) {
        // If the property is 'dateOfBirth', parse the new value to a Date object
        if (property === 'dateOfBirth') {
          let newValue = event.target.value;
          console.log(newValue);
          if (!newValue) {
            console.error('Empty date string received.');
            return;
          }
        
          newValue = formatDate(newValue, 'yyyy-MM-dd', 'en');
          console.log(newValue);

          // Update the user property
          user.dateOfBirth = newValue;

          // Update the form group with the new value
        
      }
      
       else if (property === 'role'||property==='gender') {
          newValue = event.target.value; // For <select>, directly get the selected value
        } else {
          newValue = event.target.textContent.trim(); // For other input fields
          user[property] = newValue;

        }

        // Update the user object with the new value
  console.log(user)
        // Call the service to update the user in the database
        this.userService.updateUser(user).subscribe(
          (response) => {
            console.log(response); // Log the response from the server
          },
          (error) => {
            console.error(error); // Log the error if any
          }
        );
      } else {
        console.error(`Property "${property}" does not exist in the user object.`);
      }
    }
    onSearchQueryChange() {
      this.filterUsers();
  }

  onRoleChange() {
      this.filterUsers();
  }

  filterUsers() {
      this.filteredUsers = this.users.filter(user => {
          const matchesSearch = !this.searchQuery || 
                                user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                                user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                                user.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                                user.lastName.toLowerCase().includes(this.searchQuery.toLowerCase());

          const matchesRole = !this.selectedRole || user.role === this.selectedRole;

          return matchesSearch && matchesRole;
      });
  }
  }
  
  