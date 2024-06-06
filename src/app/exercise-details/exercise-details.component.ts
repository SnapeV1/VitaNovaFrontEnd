import { Component, OnInit } from '@angular/core';
import { WorkoutService } from "../Service/workout.service";
import { Exercise } from "../Models/Exercise";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-exercise-details',
  templateUrl: './exercise-details.component.html',
  styleUrls: ['./exercise-details.component.css']
})
export class ExerciseDetailsComponent implements OnInit {
  exercise: Exercise | null = null;
  baseUrl: string = 'http://localhost:80/uploads/';

  constructor(private workoutService: WorkoutService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Fetch exercise data from a service
    this.route.params.subscribe(params => {
      const exerciseId = params['exerciseId'];
      // Use the exerciseId to fetch exercise information from the backend
      this.workoutService.getExerciseById(exerciseId).subscribe(exercise => {
        // Assign the fetched exercise information to the exercise property
        this.exercise = exercise;
        exercise.picture = this.baseUrl + exercise.picture;
      });
    });
  }
}
