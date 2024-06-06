import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card'; // Import MatCardModule
import axios from 'axios';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-recipies-low-carb',
  templateUrl: './recipies-low-carb.component.html',
  styleUrls: ['./recipies-low-carb.component.css']
})
export class RecipiesLowCarbComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  recipes: any[] = []; // Assuming recipes array

  constructor() {
  }

  ngAfterViewInit() {
    this.displayRecipes();
  }

  async fetchRecipes() {
    const options = {
      method: 'GET',
      url: 'https://low-carb-recipes.p.rapidapi.com/search',
      headers: {
        'X-RapidAPI-Key': '2acd7d6738mshdd85e14333aac07p11cf80jsn94660876c278',
        'X-RapidAPI-Host': 'low-carb-recipes.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      const recipes = response.data; // Assuming the response contains an array of recipes

      // Extract desired information for each recipe
      const formattedRecipes = recipes.map(recipe => {
        const { image, name, nutrients, ingredients, steps } = recipe;
        // Choose the specific nutrients you want to include
        const selectedNutrients = {
          caloriesKCal: nutrients.caloriesKCal,
          totalCarbs: nutrients.totalCarbs,
          protein: nutrients.protein,
          fat: nutrients.fat,
          sugar: nutrients.sugar
          // Add more keys as needed
        };
        // Return formatted recipe object
        const selectedIngredients = ingredients.map(ingredient => ({
          name: ingredient.name,
          servingSize: ingredient.servingSize,
          grams: ingredient.grams
        }));
        // Extract steps
        const selectedSteps = steps.map(step => step);

        // Return formatted recipe object including ingredients and steps
        return {
          image,
          name,
          selectedNutrients,
          ingredients: selectedIngredients,
          steps: selectedSteps
        };
      });

      return formattedRecipes;
    } catch (error) {
      console.error(error);
      return []; // Return an empty array if an error occurs
    }
  }
  flipCard(recipe: any): void {
    recipe.flipped = !recipe.flipped;
  }
  toggleCardFlip(event: MouseEvent) {
    const card = (event.target as HTMLElement).closest('.recipe-card');
    if (card) {
      card.classList.toggle('is-flipped');
    }
  }
  async displayRecipes() {
    this.recipes = await this.fetchRecipes();
    this.recipes.forEach(recipe => recipe.flipped = false);// Assign fetched recipes to component property
  }

  // Method to scroll left
  scrollLeft(): void {
    const scrollContainer = document.querySelector('.scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollBy({
        left: -200, // Adjust scroll distance as needed
        behavior: 'smooth'
      });
    }
  }

  // Method to scroll right
  scrollRight(): void {
    const scrollContainer = document.querySelector('.scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollBy({
        left: 200, // Adjust scroll distance as needed
        behavior: 'smooth'
      });
    }
  }
  scrollRecipies(direction: string, index: number) {
    const containers = document.querySelectorAll('.scroll-container');
    if (containers.length > index) {
      const container = containers[index];
      const scrollAmount = container.clientWidth / 2; // Adjust as needed
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else if (direction === 'right') {
        container.scrollLeft += scrollAmount;
      }
    }
  }


}
