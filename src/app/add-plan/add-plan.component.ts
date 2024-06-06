import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Exercise } from '../Models/Exercise';
import { WorkoutService } from '../Service/workout.service';
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import {MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan.component.html',
  styleUrls: ['./add-plan.component.css']
})
export class AddPlanComponent implements OnInit {
  workoutForm: FormGroup;
  bodyParts: string[] = ['Abdominals', 'Quadriceps', 'Shoulders', 'Chest', 'Biceps', 'Triceps', 'Lats', 'Hamstrings', 'Middle Back', 'Lower Back', 'Glutes', 'Calves', 'Forearms', 'Traps', 'Abductors', 'Adductors', 'Neck'];
  selectedBodyParts: string[] = [];
  searchText: string = '';
  exercises: Exercise[] = [];
  filteredExercises: Exercise[] = [];
  selectedExercises: Exercise[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  selectedFile: File | null = null;
  alertMessage: string | null = null;
  alertType: string | null = null;
  constructor(private formBuilder: FormBuilder,
              private workoutService: WorkoutService,public dialogRef: MatDialogRef<AddPlanComponent>,
              private sanitizer: DomSanitizer,private router:Router) {
    this.workoutForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(20)]],
      image: ['', [Validators.required, Validators.maxLength(300)]],
    });
  }

  ngOnInit(): void {
    this.getActiveExercises(0, 10);
  }


  getActiveExercises(page: number, size: number): void {
    console.log('Selected Body Parts:', this.selectedBodyParts);
    // Fetch exercises based on pagination and filtering by selected body parts
    if (this.selectedBodyParts.length === 0) {
      this.workoutService.getActiveExercises(page, size)
        .subscribe((pageData: any) => {
          this.handleExerciseResponse(pageData);
        });
    } else {
      this.workoutService.getActiveExercisesFiltered(page, size, this.selectedBodyParts)
        .subscribe((pageData: any) => {
          this.handleExerciseResponse(pageData);
        })    ;
    }
  }


  handleExerciseResponse(pageData: any): void {
    this.exercises = pageData.content;
    this.totalElements = pageData.totalElements;
    this.totalPages = pageData.totalPages;
    this.currentPage = pageData.number;
    this.searchExercises();
  }

  filterExercisesByBodyPart(): void {
    // Fetch exercises based on pagination and filtering by selected body parts
    this.currentPage = 0; // Reset to first page
    const size = 10; // Assuming 10 exercises per page
    this.getActiveExercises(0, size);
  }
  searchExercises(): void {
    if (this.searchText.trim() !== '') {
      this.filteredExercises = this.exercises.filter(exercise =>
        exercise.title.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredExercises = [...this.exercises];
    }
  }


  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      const nextPage = this.currentPage + 1;
      const size = 10;
      this.getActiveExercises(nextPage, size);
      this.searchExercises();
    }
  }
  /*filterExercisesByBodyPart(): void {
    if (this.selectedBodyParts.length === 0) {
      this.filteredExercises = [...this.exercises]; // Reset to show all exercises
    } else {
      this.filteredExercises = this.exercises.filter(exercise =>
        this.selectedBodyParts.includes(exercise.bodypart)
      );
    }

  }*/
  previousPage() {
    if (this.currentPage > 0) {
      const previousPage = this.currentPage - 1;
      const size = 10;
      this.getActiveExercises(previousPage, size);
      this.searchExercises();
    }
  }

  selectExercise(exercise: Exercise): void {
    const index = this.selectedExercises.findIndex(e => e.id === exercise.id);
    if (index === -1) {
      this.selectedExercises.push(exercise);
    } else {
      this.selectedExercises.splice(index, 1);
    }
  }

  confirmSelection(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('title', this.workoutForm.get('title')!.value);
      formData.append('archived', 'false');
      formData.append('fileImage', this.selectedFile);
      this.selectedExercises.forEach(exercise => {
        formData.append('selectedExerciseIds', exercise.id.toString());
      });
      const intensity = this.selectedExercises.length >= 10 ? 'MEDIUM' : 'LOW';
      formData.append('intensity', intensity);

      this.workoutService.addPlan(formData).subscribe(() => {
        this.workoutForm.reset();
        this.selectedFile = null;

        // Show success message
        this.showAlert('Workout plan added successfully.', 'alert-success');
      });
    } else {
      console.error('Please select an image file.');
    }
  }

  showAlert(message: string, alertType: string): void {
    this.alertMessage = message;
    this.alertType = alertType;

    // Clear the alert after a certain period (e.g., 5 seconds)
    setTimeout(() => {
      this.alertMessage = null;
      this.alertType = null;
    }, 5000); // 5000 milliseconds = 5 seconds
  }


  cancel(): void {
    this.dialogRef.close();
  }

  isSelected(exercise: Exercise): boolean {
    return this.selectedExercises.some(e => e.id === exercise.id);
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  getSelectedFileUrl(): SafeUrl | null {
    if (this.selectedFile) {
      const url = window.URL.createObjectURL(this.selectedFile);
      return this.sanitizer.bypassSecurityTrustUrl(url);
    } else {
      return null;
    }
  }
  isBodyPartSelected(part: string): boolean {
    return this.selectedBodyParts.includes(part);
  }
  toggleBodyPart(part: string) {
    if (this.isBodyPartSelected(part)) {
      this.selectedBodyParts = this.selectedBodyParts.filter(p => p !== part);
    } else {
      this.selectedBodyParts.push(part);
    }
  }
}
