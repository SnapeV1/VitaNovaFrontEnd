import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UserService } from './../../../Service/user.service';
import { PersonalGoalsModule } from 'src/app/Models/personal-goals.module';

@Component({
  selector: 'app-dialog-personal-goals',
  templateUrl: './dialog-personal-goals.component.html',
  styleUrls: ['./dialog-personal-goals.component.css']
})
export class DialogPersonalGoalsComponent {
  step: number = 1;
IdealWeight!:number;
dailyCalories:number=2800;
useIdealWeight: boolean=true ; 
numberOfWeeks:number=8;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService,private dialog: MatDialog) { }

  UpdateUser() {
    // Create a new object with updated weight and height
    const updatedUser = {
      ...this.data.userProfile,
      weight: this.data.userProfile.weight,
      height: this.data.userProfile.height
    };

    // Call the updateUser method to save the changes
    this.userService.updateUser(updatedUser).subscribe(updatedUser => {
      console.log('User updated successfully:', updatedUser);
      this.step++; 
     this.calculateIdealWeight();
    }, error => {
      console.error('Error updating user:', error);
    });
  }

  







calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100; // Convert height from centimeters to meters
  let bmi: number;
  if (this.data.userProfile.gender === 'MAN') {
    bmi = weightKg / (heightM * heightM);
  } else if (this.data.userProfile.gender  === 'WOMAN') {
    bmi = weightKg / (heightM * heightM) * 0.9; // Adjusted BMI for women
  } else {
    bmi = weightKg / (heightM * heightM) * 0.9; 
  }

  return parseFloat(bmi.toFixed(1)); // Round BMI to 1 decimal place and convert back to number
}

 interpretBMI(bmi: number): string {
  if (bmi < 18.5) {
    return "Underweight";
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    return "Normal weight";
  } else if (bmi >= 25 && bmi <= 29.9) {
    return "Overweight";
  } else {
    return "Obese";
  }
}


 calculateIdealWeightForMen(heightInCm: number): number {
  return 50 + 0.9 * (heightInCm - 152);
}

 calculateIdealWeightForWomen(heightInCm: number): number {
  return 45.5 + 0.9 * (heightInCm - 152);
}




toggleWeightInput(useIdealWeight: boolean) {
  this.useIdealWeight = useIdealWeight;

  if (!useIdealWeight) {
    // Reset ideal weight when user chooses to enter their own weight
    this.IdealWeight = undefined;
  } else {
    // Calculate and set the ideal weight based on gender and height
    this.calculateIdealWeight();
  }
}



calculateIdealWeight() {
  if (this.data.userProfile.gender === 'MAN') {
    this.IdealWeight = this.calculateIdealWeightForMen(this.data.userProfile.height);
  } else {
    this.IdealWeight = this.calculateIdealWeightForWomen(this.data.userProfile.height);

  }
}




 calculateDailyCalories( activityLevel: number): number {
  // Calculate Basal Metabolic Rate (BMR)
  let bmr: number;
  const age=this.calculateAge(this.data.userProfile.dateOfBirth);
  if (this.data.userProfile.gender === 'MAN') {
   
      bmr = 88.362 + (13.397 * this.data.userProfile.weight) + (4.799 * this.data.userProfile.height) - (5.677 * age);
  } else {
      bmr = 447.593 + (9.247 * this.data.userProfile.weight) + (3.098 * this.data.userProfile.height) - (4.330 * age);
  }

  // Adjust for activity level
  const activityFactors = [1.2, 1.375, 1.55, 1.725, 1.9]; // Sedentary, Lightly active, Moderately active, Very active, Extra active
  const activityFactor = activityFactors[activityLevel];
  const totalCalories = bmr * activityFactor;

  // Calculate calorie deficit/surplus based on weight change goal and time frame
  const totalWeeks = this.numberOfWeeks;
  const desiredWeightChange = this.data.userProfile.weight - this.IdealWeight;
  const desiredCalorieChangePerWeek = 7700 * (desiredWeightChange / totalWeeks); // 7700 calories ≈ 1 kg of body weight
  const dailyCalorieChange = desiredCalorieChangePerWeek / 7;
  this.dailyCalories = totalCalories*1.2 + dailyCalorieChange;
  if(  isNaN(  this.dailyCalories)||(  this.dailyCalories<0))  this.dailyCalories=2800;
console.log(Math.round(  this.dailyCalories));
  return Math.round(  this.dailyCalories); 
}


  setGoal(){
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + this.numberOfWeeks * 7); 
    console.log(targetDate);
    const weightDifference = this.IdealWeight - this.data.userProfile.weight;

    
    const isWeightLoss = weightDifference > 0;
    
    let weeksToGoal: number;
console.log(this.data.userProfile.personalGoals)
    if (this.data.userProfile.personalGoals === null) {
      weeksToGoal = this.numberOfWeeks; 
      
    } else {
      const startDate: Date = new Date(this.data.userProfile.personalGoals.StartDate);
      const currentDate: Date = new Date();
      const millisecondsPerWeek: number = 7 * 24 * 60 * 60 * 1000; // Milliseconds in a week
    
      weeksToGoal = Math.ceil(Math.abs(currentDate.getTime() - startDate.getTime()) / millisecondsPerWeek);
    }
        
    let description: string;
    if (!isWeightLoss) {
      description = `You're aiming to lose ${Math.abs(weightDifference).toFixed(2)} kg in ${weeksToGoal.toFixed(0)} week(s).`;
    } else {
      description = `You're aiming to gain ${Math.abs(weightDifference).toFixed(2)} kg in ${weeksToGoal.toFixed(0)} week(s).`;
    }
    
    
    const newGoal: PersonalGoalsModule = {
      weightGoal: this.IdealWeight,
      dateGoal: targetDate,
      description: description, 
      dailyNeededCalories: this.calculateDailyCalories(2), 
      weightStart:this.data.userProfile.weight
    };
   

    this.userService.addGoal(newGoal,this.data.userProfile.idUser ).subscribe(
      (response) => {
        this.data.userProfile.score++;
        console.log('Goal added successfully:', response);
        this.dialog.closeAll();

        
    },
      (error) => {
        console.error('Error adding goal:', error);
      }
    );
  }

 











  calculateAge(dateOfBirth: string): number {
    const dob = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    // If the birth month is after the current month or birth month is the same but birth day is after current day,
    // subtract 1 from age
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    return age;
}

}

  



