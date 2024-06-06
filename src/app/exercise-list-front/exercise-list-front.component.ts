import { Component, OnInit } from '@angular/core';
import { WorkoutService } from "../Service/workout.service";
import { Exercise } from "../Models/Exercise";
import { MatDialog } from '@angular/material/dialog';
import { ExerciseModalComponent } from "../exercise-modal/exercise-modal.component";
import { ExerciseLinkModelComponent } from "../exercise-link-model/exercise-link-model.component";
import { AddPlanComponent } from "../add-plan/add-plan.component";
import { UserRating } from "../Models/UserRating";
import {UserModule} from "../Models/user.module";
import {AuthService} from "../Service/auth.service";

@Component({
  selector: 'app-exercise-list-front',
  templateUrl: './exercise-list-front.component.html',
  styleUrls: ['./exercise-list-front.component.css']
})
export class ExerciseListFrontComponent implements OnInit {
  exercises: Exercise[] = [];
  baseUrl: string = 'http://localhost:80/uploads/';
  selectedExercise: Exercise | null = null;
  userRating: UserRating = new UserRating();
  selectedRating: number = 0;
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  selectedExerciseLink: string = ''; // Define selectedExerciseLink property
  sortDirection: string = 'desc'; // Default to descending order
  loading: boolean = false; // Loading flag
  userId :UserModule // Initialize userId variable

  constructor(
    private workoutService: WorkoutService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    // Retrieve userId from AuthService as an Observable
    this.authService.getUserInfoFromToken().subscribe(userId => {
      this.userId = userId;
    });
  }

  ngOnInit() {
    this.getActiveExercises(0, 15);
  }

  showExerciseDetails(exercise: Exercise): void {
    const dialogRef = this.dialog.open(ExerciseModalComponent, {
      width: '80%',
      data: exercise
    });
  }

  closeExerciseDetails(): void {
    this.selectedExercise = null;
  }

  // Define a map to store fetched exercises for each page
  cachedExercises: Map<number, Exercise[]> = new Map<number, Exercise[]>();

  // Define a map to store fetched exercises for each page


// Define an array to store fetched exercises history for navigation
  exercisesHistory: Exercise[][] = [];

  getActiveExercises(page: number, size: number): void {
    this.loading = true; // Set loading to true when fetching data

    // Check if exercises for the current page are already cached
    if (this.cachedExercises.has(page)) {
      // If cached, retrieve exercises from the cache
      this.exercises = this.cachedExercises.get(page) || [];
      this.loading = false; // Set loading to false
    } else {
      // If not cached, fetch exercises from the server
      this.workoutService.getActiveExercises(page, size).subscribe((pageData: any) => {
        const fetchedExercises: Exercise[] = pageData.content;
        this.totalElements = pageData.totalElements;
        this.totalPages = pageData.totalPages;
        this.currentPage = pageData.number;

        fetchedExercises.forEach(exercise => {
          exercise.picture = this.baseUrl + exercise.picture;

          this.workoutService.getAverageRating(exercise.id).subscribe((rating: number) => {
            exercise.rating = rating;
          });
        });

        // Cache fetched exercises for the current page
        this.cachedExercises.set(page, fetchedExercises);
        // Add fetched exercises to the exercises history
        this.exercisesHistory[page] = fetchedExercises;

        // Set the exercises array to the fetched exercises
        this.exercises = fetchedExercises;

        this.loading = false; // Set loading to false
      });
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      const nextPage = this.currentPage + 1;
      const size = 15; // Page size
      this.currentPage = nextPage;
      if (this.sortDirection == 'asc') {
        // Toggle sort direction before navigating
        this.toggleSortDirection();
      }
      if (this.exercisesHistory[nextPage]) {
        // If exercises for the next page are available in history, retrieve them from history
        this.exercises = this.exercisesHistory[nextPage];
      } else {
        // Otherwise, fetch exercises for the next page
        this.getActiveExercises(nextPage, size);
      }
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      const previousPage = this.currentPage - 1;
      const size = 15; // Page size
      this.currentPage = previousPage;
      if (this.sortDirection == 'asc') {
        // Toggle sort direction before navigating
        this.toggleSortDirection();
      }
      if (this.exercisesHistory[previousPage]) {
        // If exercises for the previous page are available in history, retrieve them from history
        this.exercises = this.exercisesHistory[previousPage];
      } else {
        // Otherwise, fetch exercises for the previous page
        this.getActiveExercises(previousPage, size);
      }
    }
  }


  toggleExerciseDetails(exercise: Exercise): void {
    if (this.selectedExercise === exercise) {
      this.selectedExercise = null;
    } else {
      this.selectedExercise = exercise;
    }
  }

  rateExercise(userId: number, exerciseId: number, rating: number): void {
    // Create a new instance of UserRating
    const userRating = new UserRating();
    userRating.rate = rating;
    userRating.iduser = new UserModule(); // Initialize iduser with a new instance of UserModule
    userRating.iduser.idUser = userId; // Set the userId
    userRating.exerciseId = new Exercise(); // Initialize exerciseId with a new instance of Exercise
    userRating.exerciseId.id = exerciseId; // Set the exerciseId

    // Call the service method with the new userRating object
    this.workoutService.saveUserExerciseRating(userRating, exerciseId, userId).subscribe(
      response => {
        console.log('Évaluation sauvegardée avec succès', response);
        // Mettez à jour la liste des exercices si nécessaire
      },
      error => {
        console.error('Erreur lors de la sauvegarde de l\'évaluation', error);
      }
    );
  }


  copyExerciseLink(exerciseId: number): void {
    // Set selected exercise link
    this.selectedExerciseLink = `localhost:4200/exercises/${exerciseId}`;

    // Open the dialog with the exercise link
    this.dialog.open(ExerciseLinkModelComponent, {
      data: {exerciseLink: this.selectedExerciseLink},
      width: '80%',
    });
  }

  openCreateWorkoutDialog(): void {
    const dialogRef = this.dialog.open(AddPlanComponent, {
      width: '500px',
      // Optionally pass data to the dialog if needed
      // data: { /* your data */ }
    });
  }

  // Function to sort exercises by rating


  // Function to toggle sort direction and re-sort exercises
  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortExercises(); // Call the method to sort the exercises
  }

  private sortExercises(): void {
    // Call your backend service to fetch sorted exercises based on current sort direction
    this.workoutService.getExercisesSortedByRating(this.currentPage, 15)
      .subscribe((pageData: any) => {
        const fetchedExercises: Exercise[] = pageData.content;

        this.totalElements = pageData.totalElements;
        this.totalPages = pageData.totalPages;
        this.currentPage = pageData.number;

        this.exercises = fetchedExercises.map(exercise => {
          exercise.picture = this.baseUrl + exercise.picture;
          this.workoutService.getAverageRating(exercise.id).subscribe((rating: number) => {
            exercise.rating = rating;
          });
          return exercise;
        });
      });
  }
}
