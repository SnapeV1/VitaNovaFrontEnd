import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Exercise } from '../Models/Exercise';
import { WorkoutService } from '../Service/workout.service';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-exercise',
  templateUrl: './addexercise.component.html',
  styleUrls: ['./addexercise.component.css']
})
export class AddexerciseComponent implements OnInit {
  exerciseForm: FormGroup;
  intensity: string[] = ['HIGH', 'LOW', 'MEDIUM'];
  selectedFile: File | null = null;
  exercise: Exercise = new Exercise();

      constructor(private formBuilder: FormBuilder, private sanitizer: DomSanitizer, private workoutService: WorkoutService, private route: ActivatedRoute) {
    this.exerciseForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.maxLength(300)]],
      typeEx: ['', [Validators.required, Validators.maxLength(20)]],
      bodypart: ['', [Validators.required, Validators.maxLength(20)]],
      intensity: ['', [Validators.required, Validators.maxLength(20)]],
      sets: ['', Validators.required],
      reps: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const exerciseData: Exercise | null = history.state.exercise;
    if (exerciseData) {
      this.exercise = exerciseData;
      this.populateFormWithExerciseData();
    } else {
      console.error("Exercise data is not present in the state.");
    }
  }


  onSubmit(): void {
    if (this.exercise.id) {
      this.updateExercise();
    } else {
      this.addExercise();
    }
  }

  addExercise(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('title', this.exerciseForm.get('title')!.value);
      formData.append('description', this.exerciseForm.get('description')!.value);
      formData.append('typeEx', this.exerciseForm.get('typeEx')!.value);
      formData.append('bodypart', this.exerciseForm.get('bodypart')!.value);
      formData.append('intensity', this.exerciseForm.get('intensity')!.value);
      formData.append('sets', this.exerciseForm.get('sets')!.value);
      formData.append('reps', this.exerciseForm.get('reps')!.value);
      formData.append('file', this.selectedFile);

      this.workoutService.addExercise(formData).subscribe(() => {
        this.exerciseForm.reset();
        this.selectedFile = null;
      });
    } else {
      console.error('Please select an image file.');
    }
  }

  onFileChanged(event: any): void {
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
  updateExercise():void{
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('title', this.exerciseForm.get('title')!.value);
      formData.append('description', this.exerciseForm.get('description')!.value);
      formData.append('typeEx', this.exerciseForm.get('typeEx')!.value);
      formData.append('bodypart', this.exerciseForm.get('bodypart')!.value);
      formData.append('intensity', this.exerciseForm.get('intensity')!.value);
      formData.append('sets', this.exerciseForm.get('sets')!.value);
      formData.append('reps', this.exerciseForm.get('reps')!.value);
      formData.append('file', this.selectedFile);

      this.workoutService.updateExercise(formData,this.exercise.id).subscribe(() => {
        this.exerciseForm.reset();
        this.selectedFile = null;
      });
    } else {
      console.error('Please select an image file.');
    }
  }


  populateFormWithExerciseData(): void {
    this.exerciseForm.patchValue({
      title: this.exercise.title,
      description: this.exercise.description,
      typeEx: this.exercise.typeEx,
      bodypart: this.exercise.bodypart,
      intensity: this.exercise.intensity,
      sets: this.exercise.sets,
      reps: this.exercise.reps,
      picture:this.exercise.picture
    });
  }
}
