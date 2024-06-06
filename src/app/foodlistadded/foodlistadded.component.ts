import { Component, OnInit } from '@angular/core';
import { FoodService } from '../Service/food.service';
import {FoodCard} from "../Models/FoodCard";
import {FoodDetailsDialogComponent} from "../food-details-dialog/food-details-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {Tracker} from "../models/Tracker";
import {style} from "@angular/animations";
import {AuthService} from "../Service/auth.service";
import {UserModule} from "../Models/user.module";
import {Router} from "@angular/router";

@Component({
  selector: 'app-foodlistadded',
  templateUrl: './foodlistadded.component.html',
  styleUrls: ['./foodlistadded.component.css']
})
export class FoodlistaddedComponent implements OnInit {

  eatenFoodCards: FoodCard[] = [];
  loading = true;
  error: string | null = null;
  breakfast: FoodCard[]=[]; // Initialisation des listes
  lunch: FoodCard[]=[];
  dinner: FoodCard[]=[];
  snacks: FoodCard[]=[];
  tracker :Tracker;
  userId:UserModule
  constructor(private foodService: FoodService, private dialog: MatDialog,private authService: AuthService,private router:Router) {
    this.authService.getUserInfoFromToken().subscribe(userId => {
      this.userId = userId;
    });
  }

  ngOnInit(): void {
    this.getEatenFoods();
  }

  getEatenFoods(): void {
    this.foodService.getListEaten().subscribe(
      (foodCards: Array<FoodCard>) => { // Specify the type as Array<FoodCard>
        this.eatenFoodCards = foodCards;
        this.loading = false;
      },
      (error) => {
        this.error = 'Error fetching eaten foods: ' + error;
        this.loading = false;
      }
    );
  }

  deleteFoodCard(foodCard: FoodCard): void {
    const isConfirmed = window.confirm('Are you sure you want to delete this food card?');
    if (isConfirmed) {
      this.foodService.deleteFoodCard(foodCard).subscribe(
        () => {
          // Suppression réussie
          // Mettre à jour la liste des cartes alimentaires si nécessaire
          this.getEatenFoods();
        },
        (error) => {
          console.error('Error deleting food card:', error);
          // Gérer l'erreur ici
        }
      );
    } else {
      // Annulation de la suppression
      console.log('Suppression annulée');
    }
  }

  calculateCalories(foodCard: FoodCard): void {
    foodCard.calcCalories = foodCard.food.calories * foodCard.quantity;
    console.log("foodcard: " , foodCard)
    // Mettre à jour la quantité dans la liste des cartes alimentaires
    if(foodCard){
      this.foodService.updateFoodCards([foodCard.food], foodCard.quantity).subscribe(
        () => {
          console.log('Food card updated successfully');
        },
        (error) => {
          console.error('Error updating food card:', error);
        }
      );
    } else {
      // Si le FoodCard n'existe pas encore dans la liste, l'ajouter
      this.eatenFoodCards.push(foodCard);
      // Enregistrer le nouveau FoodCard sur le serveur
      this.foodService.updateFoodCards([foodCard.food], foodCard.quantity).subscribe(
        () => {
          console.log('New food card created successfully');
        },
        (error) => {
          console.error('Error creating new food card:', error);
        }
      );
    }
  }
  saveTracker(): void {
    this.foodService.addTracker(this.tracker,this.userId.idUser).subscribe(
      (response) => {
        console.log('Tracker added successfully:', response);
        this.router.navigate(['vitaNova/mealCard']);
      },
      (error) => {
        console.error('Error adding tracker:', error);

      }
    );
  }

  protected readonly style = style;
}
