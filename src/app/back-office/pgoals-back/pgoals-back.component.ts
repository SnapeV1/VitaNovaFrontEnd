import { Component } from '@angular/core';
import { PgoalsServicesService } from './../../Service/pgoals-services.service';
import { PersonalGoalsModule } from 'src/app/Models/personal-goals.module';
import { UserService } from 'src/app/Service/user.service';
import { UserModule } from 'src/app/Models/user.module';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-pgoals-back',
  templateUrl: './pgoals-back.component.html',
  styleUrls: ['./pgoals-back.component.css']
})
export class PgoalsBackComponent {
  constructor(private PgoalsService:PgoalsServicesService,private userService:UserService) {
   this.getUsers();
  }
  Goals: PersonalGoalsModule[]= [];
  users: UserModule[]= [];


  ngOnInit(): void {
   console.log(this.users)
  }




  getUsers(){
    this.userService.getUsers().subscribe(
      (users: UserModule[]) => {
        this.users = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  
  }





  updateGoalProperty(event: any, personalG: PersonalGoalsModule, property: string) {
   
    // Get the new value from the input field
    let newValue = event.target.textContent.trim();

    // Check if the property exists in the user object
    if (personalG.hasOwnProperty(property)) {
      // If the property is 'dateOfBirth', parse the new value to a Date object
      if (property === 'dateGoal') {
        let newValue = event.target.value;
        console.log(newValue);
        if (!newValue) {
          console.error('Empty date string received.');
          return;
        }
      
        newValue = formatDate(newValue, 'yyyy-MM-dd', 'en');
        console.log(newValue);

        // Update the user property
        personalG.dateGoal = newValue;

        // Update the form group with the new value
      
    }
    
     else {
        newValue = event.target.textContent.trim(); // For other input fields
        personalG[property] = newValue;

      }

      // Update the user object with the new value
console.log(personalG)
      // Call the service to update the user in the database
      this.PgoalsService.updatePgoal(personalG).subscribe(
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

  deletePg(user: UserModule) {
    this.PgoalsService.DeletePgoal(user).subscribe(
      () => {
        this.users = this.users.filter(u => u.personalGoals !== user.personalGoals);
      }
    );
  }




}
