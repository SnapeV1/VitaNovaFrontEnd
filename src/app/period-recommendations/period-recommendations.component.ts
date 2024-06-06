import { Component } from '@angular/core';
import { PeriodTracker } from '../Models/PeriodTracker';
import { PeriodTrackerServiceService } from '../Service/period-tracker-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Exercise } from '../Models/Exercise';
import { Food } from '../Models/Foods';

@Component({
  selector: 'app-period-recommendations',
  templateUrl: './period-recommendations.component.html',
  styleUrls: ['./period-recommendations.component.css']
})
  
export class PeriodRecommendationsComponent {
  periodTrackers: PeriodTracker[] = [];
  cyclePhase: string = 'Unknown'; // Default value or placeholder
  idPeriod!: number;
  nextOvulationDate?: string;
  nextPeriodDate?: string;
  userQuestion: string = ''; // Track user input
  chatHistory: string[] = [];
  exercises: Exercise[]= [];
  foods: Food[]= []; // Define an array to store fetched foods


  constructor(private route: ActivatedRoute, private periodTrackerService: PeriodTrackerServiceService,private router: Router) { }

    

  ngOnInit(): void {


    
    this.route.queryParams.subscribe(params => {
  
        this.getPeriodExercises();
        this.fetchPeriodFoods();
      
    });
  }


  getPeriodExercises(): void {
    this.periodTrackerService.getPeriodExercises()
      .subscribe(exercises => this.exercises = exercises);
  }
  fetchPeriodFoods(): void {
    this.periodTrackerService.getPeriodFood()
      .subscribe(foods => this.foods = foods);
  }
  getRecipes(): void {
      // Navigate to PeriodInsightsComponent with the period ID as a query parameter
      this.router.navigate(['vitaNova/PeriodRecipes']);
    }
    getCyclePhase(idPeriod: number): void {
      if (idPeriod) {
        // Navigate to PeriodInsightsComponent with the period ID as a query parameter
        this.router.navigate(['vitaNova/PeriodInsights'], { queryParams: { id: idPeriod } });
      }
    }
}
