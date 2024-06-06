import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkoutService } from '../Service/workout.service';
import { WorkoutPlan } from '../Models/WorkoutPlan';
import {AuthService} from "../Service/auth.service";
import {UserModule} from "../Models/user.module";
import axios from "axios";

@Component({
  selector: 'app-timer-page',
  templateUrl: './timer-page.component.html',
  styleUrls: ['./timer-page.component.css']
})
export class TimerPageComponent implements OnInit {
  workoutPlan: WorkoutPlan | null = null;
  remainingTime: number | null = null;
  timerInterval: any;
  currentSet: number = 0;
  currentInterval: 'exercise' | 'rest' = 'exercise';
  currentExerciseIndex: number = 0;
  currentExerciseImage: string | null = null;
  baseUrl: string = 'http://localhost:80/uploads/';
  timerClass: string = 'base-timer__path-remaining';
  userId :UserModule
  mp3DownloadLink: string | null = null;

  COLOR_CODES = {
    info: {
      color: "green"
    },
    warning: {
      color: "orange",
      threshold: 10 // Adjust as needed
    },
    alert: {
      color: "red",
      threshold: 5 // Adjust as needed
    }
  };
  // Define WARNING_THRESHOLD and ALERT_THRESHOLD properties
  WARNING_THRESHOLD: number = 10; // Set your desired threshold values
  ALERT_THRESHOLD: number = 5;

  constructor(
    private route: ActivatedRoute,
    private workoutService: WorkoutService,
    private authService: AuthService
  ) {
    this.authService.getUserInfoFromToken().subscribe(userId => {
      this.userId = userId;
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.getWorkoutPlan(parseInt(id, 10));
      }
    });
  }

  getWorkoutPlan(id: number): void {
    this.workoutService.getWorkoutPlanById(id).subscribe(plan => {
      this.workoutPlan = plan;
    });
  }

  stopTimer(): void {
    clearInterval(this.timerInterval);
    // Store the remaining time when stopping the timer
    if (this.remainingTime !== null) {
      this.getTimerClass();
    }
    this.timerInterval = null;
  }

  startTimer(): void {
    if (!this.timerInterval) {
      this.loadCurrentExerciseImage(); // Load image here

      // Start the timer with the remaining time if it exists
      if (this.remainingTime !== null) {
        this.startNextSet(this.remainingTime);
      } else {
        this.startNextSet();
      }

      // Fetch MP3 download link
      this.fetchMP3DownloadLink();

      // Play audio
      this.playAudio();
    }
    this.addSession(); // Calling addSession method here
  }


  resetTimer(): void {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.remainingTime = null;
    this.currentSet = 0;
    this.currentInterval = 'exercise';
    this.currentExerciseIndex = 0;
  }

  startNextSet(remainingTime?: number): void {
    if (this.workoutPlan && this.currentExerciseIndex < this.workoutPlan.exercises.length) {
      const currentExercise = this.workoutPlan.exercises[this.currentExerciseIndex];
      const totalSets = parseInt(currentExercise.sets.split('-')[1]);

      if (this.currentSet < totalSets) {
        const duration = this.currentInterval === 'exercise' ? 20 : 15; // Exercise duration is 1 minute, rest duration is 45 seconds
        this.remainingTime = remainingTime !== undefined ? remainingTime : duration;

        this.timerInterval = setInterval(() => {
          if (this.remainingTime && this.remainingTime > 0) {
            this.remainingTime--;
            this.getTimerClass();

          } else {
            clearInterval(this.timerInterval);
            // Switch to the next interval (exercise/rest)
            this.currentInterval = this.currentInterval === 'exercise' ? 'rest' : 'exercise';

            if (this.currentInterval === 'exercise') {
              this.currentSet++;
            } else {
              // Move to the next exercise if all sets are completed
              if (this.currentSet === totalSets) {
                this.currentSet = 0;
                this.currentExerciseIndex++;
                // Load the image for the next exercise
                this.loadCurrentExerciseImage(); // Load image here
              }
            }

            // Set the duration for the next interval
            const nextDuration = this.currentInterval === 'exercise' ? 20 : 15;
            this.startNextSet(nextDuration);
          }
        }, 1000);
      } else {
        // Move to the next exercise if all sets are completed
        this.currentSet = 0;
        this.currentExerciseIndex++;
        // Load the image for the next exercise
        this.loadCurrentExerciseImage(); // Load image here
        this.currentInterval = 'exercise';
        this.startNextSet();
      }
    }
  }


  loadCurrentExerciseImage(): void {
    if (this.workoutPlan && this.workoutPlan.exercises.length > this.currentExerciseIndex) {
      const currentExercise = this.workoutPlan.exercises[this.currentExerciseIndex];
      // Assuming `image` is the property that holds the image URL in your Exercise model
      this.currentExerciseImage = this.baseUrl + currentExercise.picture;
      console.log(currentExercise);
    } else {
      this.currentExerciseImage = null; // Reset image if no more exercises
    }
  }


  isExerciseCompleted(exerciseIndex: number): boolean {
    return exerciseIndex < this.currentExerciseIndex;
  }

  formatTime(remainingTime: number | null): string {
    if (remainingTime === null) {
      return '00:00:00';
    }

    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  getCurrentStep(): { exerciseIndex: number, setIndex: number } {
    return { exerciseIndex: this.currentExerciseIndex, setIndex: this.currentSet };
  }

  getTimerClass(): void {
    if (this.remainingTime !== null) {
      const { alert, warning } = this.COLOR_CODES;
      let remainingPathColor = 'green'; // Default color if not in alert or warning zone

      if (this.remainingTime <= alert.threshold) {
        remainingPathColor = 'red'; // Change to red if remaining time is less than alert threshold
      } else if (this.remainingTime <= warning.threshold) {
        remainingPathColor = 'orange'; // Change to orange if remaining time is less than warning threshold
      }

      this.timerClass = `base-timer__path-remaining ${remainingPathColor}`;
    }
  }




  getColorClass(remainingTime: number | null): string {
    if (remainingTime === null) {
      return 'info'; // Default color
    }

    if (remainingTime <= this.WARNING_THRESHOLD) {
      return 'warning'; // Apply warning color class
    } else if (remainingTime <= this.ALERT_THRESHOLD) {
      return 'alert'; // Apply alert color class
    } else {
      return 'info'; // Default color
    }
  }
  addSession(): void {
    const workoutSessionData = {
      // Map intensity level
      // Include relevant data for the workout session
    };

    this.workoutService.addSession(workoutSessionData, this.userId.idUser,this.workoutPlan.intensity).subscribe(
        (response) => {
          console.log('Session added successfully:', response);
          // Optionally, perform any additional actions after adding the session
        },
        (error) => {
          console.error('Error adding session:', error);
        }
    );
  }
  async fetchMP3DownloadLink(): Promise<void> {
    const options = {
      method: 'GET',
      url: 'https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/',
      params: {
        url: 'https://www.youtube.com/watch?v=hN5MBlGv2Ac'
      },
      headers: {
        'X-RapidAPI-Key': '2acd7d6738mshdd85e14333aac07p11cf80jsn94660876c278',
        'X-RapidAPI-Host': 'youtube-mp3-downloader2.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      const data = response.data;
      if (data && data.status === 'finished') {
        this.mp3DownloadLink = data.dlink;
      } else {
        console.error('Error: Invalid response from the API');
      }
    } catch (error) {
      console.error('Error fetching MP3 download link:', error);
    }
  }
  playAudio(): void {
    const audioPlayer = document.getElementById('audioPlayer') as HTMLAudioElement;
    if (audioPlayer) {
      audioPlayer.play();
    }
  }
}
