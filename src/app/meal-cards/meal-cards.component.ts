import { Component, OnInit } from '@angular/core';
import { FoodService } from '../Service/food.service';
import { Router } from '@angular/router';
import { MealType } from '../models/MealType';
import { FoodCard } from '../Models/FoodCard';
import { Tracker } from "../models/Tracker";
import { UserModule } from "../Models/user.module";
import { AuthService } from "../Service/auth.service";

@Component({
  selector: 'app-meal-cards',
  templateUrl: './meal-cards.component.html',
  styleUrls: ['./meal-cards.component.css']
})
export class MealCardsComponent implements OnInit {
  breakfastFoodCards: FoodCard[] = [];
  lunchFoodCards: FoodCard[] = [];
  dinnerFoodCards: FoodCard[] = [];
  snacksFoodCards: FoodCard[] = [];
  mealtype: MealType;
  userId: UserModule;
  idtracker: number;
  test:number = 0;
  BreakfastCalories: number = 0;
  lunchCalories : number= 0;
  DinnerCalories  : number = 0;


  waterConsumed: number = 0;
  calculatedCalories: { breakfast: number, lunch: number, dinner: number,snacks:number };

  glasses = [
    { id: 1, filled: false },
    { id: 2, filled: false },
    { id: 3, filled: false },
    { id: 4, filled: false }
  ];

  constructor(private foodService: FoodService, private router: Router, private authService: AuthService) {
    this.authService.getUserInfoFromToken().subscribe(userId => {
      this.userId = userId;
      this.BreakfastCalories=parseInt(sessionStorage.getItem('BreakfastCalories'));
      this.lunchCalories  =parseInt(sessionStorage.getItem('lunchCalories'));
      this.DinnerCalories  =parseInt(sessionStorage.getItem('DinnerCalories'));
      this.test  =parseInt(sessionStorage.getItem('SnacksCalories'));

      
      console.log(this.BreakfastCalories,this.lunchCalories,this.DinnerCalories)
      // Fetch hydration data once user info is available
      this.fetchHydrationData();

    });

  

  }

  ngOnInit(): void {
    this.calculateCaloriesForMeals();
    this.BreakfastCalories=parseInt(sessionStorage.getItem('BreakfastCalories'));
    this.lunchCalories  =parseInt(sessionStorage.getItem('lunchCalories'));
    this.DinnerCalories  =parseInt(sessionStorage.getItem('DinnerCalories'));
    
    console.log(this.BreakfastCalories,this.lunchCalories,this.DinnerCalories)
  }

  fetchHydrationData(): void {
    if (this.userId) {
      // Call the getHydrationForToday method to fetch hydration data
      this.foodService.getHydrationForToday(this.userId.idUser).subscribe(
        (hydrationData) => {
          console.log('Hydration data for today:', hydrationData);
          // Update waterConsumed based on sumofwater
          this.waterConsumed = hydrationData?.sumofwater || 0;
          // Fill glasses based on waterConsumed
          this.fillGlasses();
        },
        (error) => {
          console.error('Error fetching hydration data:', error);
          // Handle error appropriately
        }
      );
    } else {
      console.error('User info is not available. Unable to fetch hydration data.');
      // Handle the case where user info is not available
    }
  }

  fillGlasses(): void {
    // Calculate the number of glasses to fill completely and the remaining water for the partially filled glass
    const fullGlasses = Math.floor(this.waterConsumed / 0.5);
    const remainingWater = this.waterConsumed % 0.5;

    // Reset all glasses to empty
    this.glasses.forEach(glass => glass.filled = false);

    // Fill the glasses up to fullGlasses
    for (let i = 0; i < fullGlasses; i++) {
      this.glasses[i].filled = true;
    }

    // If there's remaining water, partially fill the next glass
    if (remainingWater > 0) {
      this.glasses[fullGlasses].filled = true;
    }
  }

  addFoodToMeal(mealType: MealType): void {
    // Navigate to the food front component with the meal type as a parameter
    this.router.navigate(['vitaNova/foodFront'], { queryParams: { mealType: mealType } });
  }


  protected readonly MealType = MealType;

  toggleWater(glass): void {
    // Toggle water level of the clicked glass
    glass.filled = !glass.filled;
    if (this.userId) {
      if (glass.filled) {
        // Call the addHydration method when a glass is clicked
        this.foodService.addHydration(this.userId.idUser).subscribe(
          (response) => {
            console.log('Hydration added successfully:', response);
            // Perform any additional actions if needed
            // Fetch hydration data after adding hydration
            this.fetchHydrationData();
          },
          (error) => {
            console.error('Error adding hydration:', error);
            // Handle error appropriately
          }
        );
      } else {
        // Call the unfillCup method when a glass is unfilled
        this.unfillCup(this.userId.idUser);

      }
    } else {
      console.error('User info is not available. Unable to add/delete hydration.');
      // Handle the case where user info is not available
    }
  }

  unfillCup(userId: number): void {
    this.foodService.unfillCup(userId).subscribe(
      (response: any) => {
        console.log('Cup unfilled successfully:', response);
        // Assuming you want to update the UI after unfilling the cup, you can fetch hydration data again
        this.fetchHydrationData();
      },
      (error: any) => {
        console.error('Error unfilling cup:', error);
        // Handle error response, such as displaying an error message
        // For example, you could set a flag to display an error message in the UI
      }
    );
  }
  calculateCaloriesForMeals(): void {
    // Assuming you have the user's personal goals available in this.userId.personalGoals
    if (this.userId && this.userId.personalGoals) {
      const totalDailyCalories = this.userId.personalGoals.dailyNeededCalories;
      // You can adjust the ratios based on your preferences
      this.BreakfastCalories = totalDailyCalories * 0.25; // Adjusted ratio for breakfast
      const lunchCalories = totalDailyCalories * 0.35; // Adjusted ratio for lunch
      const dinnerCalories = totalDailyCalories * 0.25; // Adjusted ratio for dinner
      const snacksCalories = totalDailyCalories * 0.15; // Adjusted ratio for snacks

      // Assign the calculated values to the property
      this.calculatedCalories = { breakfast: this.BreakfastCalories, lunch: lunchCalories, dinner: dinnerCalories, snacks: snacksCalories };
    }
  }




}
