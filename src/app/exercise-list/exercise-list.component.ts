import {Component, OnInit} from '@angular/core';
import {Exercise} from "../Models/Exercise";
import {WorkoutService} from "../Service/workout.service";
import {DomSanitizer} from "@angular/platform-browser";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-exercise-list',
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.css']
})
export class ExerciseListComponent implements OnInit {
  exercises: Exercise[] = [];
  exerciseForm: FormGroup;
  baseUrl: string = 'http://localhost:80/uploads/';
  editingExercise: Exercise | null = null;
  private router!: Router;
  searching: boolean = false;
  searchTerm: string = '';
  filteredExercises: Exercise[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  selectedExerciseLink: string = ''; // Define selectedExerciseLink property


  constructor(private formBuilder: FormBuilder, private workoutService: WorkoutService, private sanitizer: DomSanitizer, private route: Router) {
    this.exerciseForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.maxLength(300)]],
      typeEx: ['', [Validators.required, Validators.maxLength(20)]],
      bodypart: ['', [Validators.required, Validators.maxLength(20)]],
      intensity: ['', [Validators.required, Validators.maxLength(20)]],
      sets: ['', Validators.required],
      reps: ['', Validators.required]
    });
    this.router = route;
  }

  ngOnInit(): void {
    this.getExercises(0,10);
  }
  toggleSearch(): void {
    this.searching = !this.searching;
    if (!this.searching) {
      this.searchTerm = ''; // Clear search term when toggling off
      this.filteredExercises = [...this.exercises]; // Reset filtered array
    }
  }

  search(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredExercises = [...this.exercises]; // Reset filtered array if search term is empty
      return;
    }

    // Perform multiple search logic here
    const searchLower = this.searchTerm.toLowerCase();
    this.filteredExercises = this.exercises.filter(exercise =>
        exercise.title.toLowerCase().includes(searchLower) ||
        exercise.intensity.toLowerCase().includes(searchLower) ||
        exercise.bodypart.toLowerCase().includes(searchLower)||
        exercise.typeEx.toLowerCase().includes(searchLower)||
        exercise.reps||
        exercise.sets
      // Add more criteria if needed
      // exercise.typeEx.toLowerCase().includes(searchLower) ||
      // exercise.bodypart.toLowerCase().includes(searchLower) ||
      // ...

    );
  }

  clearSearch(): void {
    this.searchTerm = ''; // Clear search term
    this.filteredExercises = [...this.exercises]; // Reset filtered array
  }
  getExercises(page: number, size: number): void {
    this.workoutService.getExercises(page, size)
      .subscribe((pageData: any) => { // Added missing parentheses
        this.exercises = pageData.content; // Extracting content from the paginated response
        this.totalElements = pageData.totalElements;
        this.totalPages = pageData.totalPages;
        this.currentPage = pageData.number;
        // Sanitize image URLs
        this.exercises.forEach(exercise => {
          exercise.picture = this.baseUrl + exercise.picture;
        });
      });
  }


  deleteExercise(exercise: Exercise): void {
    const confirmationMessage = exercise.archived
      ? 'Are you sure you want to unarchive this exercise? Title: ' + exercise.title
      : 'Are you sure you want to archive this exercise? Title: ' + exercise.title;

    if (confirm(confirmationMessage)) {
      // Toggle the archived status
      exercise.archived = !exercise.archived;

      // Update the archived status on the server
      this.workoutService.deleteExercise(exercise.id).subscribe(
        () => {
          if (exercise.archived) {
            this.showAlert('Exercise archived successfully.', 'alert-success');
          } else {
            this.showAlert('Exercise unarchived successfully.', 'alert-success');
          }
        },
        (error) => {
          console.error('Error updating exercise:', error);
          this.showAlert('Failed to update exercise status.', 'alert-danger');
          // Revert the toggle if the update fails
          exercise.archived = !exercise.archived;
        }
      );
    }
  }

  showAlert(message: string, type: string): void {
    const alertElement = document.createElement('div');
    alertElement.classList.add('alert', `alert-${type}`);
    alertElement.textContent = message;
    alertElement.className = `alert alert-${type}`;
    alertElement.style.padding = '15px';
    alertElement.style.marginTop = '20px';
    alertElement.style.borderRadius = '4px';
    document.body.appendChild(alertElement);
    setTimeout(() => {
      alertElement.remove();
    }, 5000); // Remove the alert after 5 seconds
  }
  showDeleteAlert: boolean = false;

  confirmDelete(exercise: Exercise): void {
    this.showDeleteAlert = true;
  }

  deleteConfirmed(): void {
    // Code to delete the exercise
    this.showDeleteAlert = false; // Hide the alert after confirmation
  }

  cancelDelete(): void {
    this.showDeleteAlert = false; // Hide the alert if the user cancels
  }

  /*editExercise(exercise : Exercise){
    this.editingExercise=exercise;
    this.exerciseForm.patchValue({
      title:exercise.title,
      description:exercise.description,
      typeEx:exercise.typeEx,
      bodypart:exercise.bodypart,
      intensity:exercise.intensity,
      sets:exercise.sets,
      reps:exercise.reps
      }
    );*/
  editExercise(exercise: Exercise): void {
    this.router.navigate(['/admin/exercise'], { state:{exercise}}); // Inclure toutes les données de l'exercice dans le state
  }
  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      const nextPage = this.currentPage + 1;
      const size = 10; // Page size
      this.getExercises(nextPage, size);
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      const previousPage = this.currentPage - 1;
      const size =10; // Page size
      this.getExercises(previousPage, size);
    }
  }


}
