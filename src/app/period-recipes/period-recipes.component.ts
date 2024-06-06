import { Component,OnInit  } from '@angular/core';
import axios from 'axios';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-period-recipes',
  templateUrl: './period-recipes.component.html',
  styleUrls: ['./period-recipes.component.css']
})
export class PeriodRecipesComponent  implements OnInit {
  recipes: any[] = [];

constructor(    private router: Router,
  private route: ActivatedRoute,
) { }

ngOnInit(): void {
  this.fetchRecipes();
}
async fetchRecipes(): Promise<void> {
  const options = {
    method: 'GET',
    url: 'https://edamam-recipe-search.p.rapidapi.com/api/recipes/v2',
    params: {
      type: 'public',
      co2EmissionsClass: 'A+',
      'field[0]': 'uri',
      'nutrients[VITB6A]': '+10',
      'nutrients[VITB12]': '+10',
      'nutrients[FE]': '+50',
      beta: 'true',
      random: 'true',
      'cuisineType[0]': 'arabic',
      'imageSize[0]': 'medium',
      'nutrients[CA]': '+50',    },
    headers: {
      'Accept-Language': 'en',
      'X-RapidAPI-Key': '020a985271msh63da4e188052ac8p1761aajsn6b9e047c9fb3',
      'X-RapidAPI-Host': 'edamam-recipe-search.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    this.recipes = response.data.hits.map((hit: any) => hit.recipe);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    this.recipes = []; // Reset recipes array on error
  }
}

getBack(): void {
  // Navigate to PeriodInsightsComponent with the period ID as a query parameter
  this.router.navigate(['vitaNova/PeriodRecommendations']);
}
}