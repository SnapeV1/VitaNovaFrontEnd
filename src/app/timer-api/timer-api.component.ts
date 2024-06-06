  import { Component, OnInit } from '@angular/core';
  import { ActivatedRoute } from '@angular/router';
  import {WorkoutService} from "../Service/workout.service";
  import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
  import axios from 'axios';
  import {AuthService} from "../Service/auth.service";
  import {UserModule} from "../Models/user.module";


  @Component({
    selector: 'app-timer-api',
    templateUrl: './timer-api.component.html',
    styleUrls: ['./timer-api.component.css']
  })
  export class TimerApiComponent implements OnInit {
    workoutPlan: any = null;
    timerInterval: any;
    remainingTime: number | null = null;
    currentSet: number = 0;
    currentInterval: 'exercise' | 'rest' = 'exercise';
    currentExerciseIndex: number = 0;
    currentExerciseImage: string | null = null; // Declare currentExerciseImage property
    baseUrl: string = 'http://localhost:80/uploads/';
    timerClass: string = 'base-timer__path-remaining';
    youtubeVideo: any = null; //
    EXERCISE_DURATION = 45; // Duration of exercise in seconds
    REST_DURATION = 20; // Duration of rest in seconds
    audioUrls: string[] = []; // Déclarez un tableau pour stocker les URLs audio
    youtubeAudioUrls: any[] = []; // Array to store YouTube audio URLs
    intensity: string = '';
   // audioList: { downloadUrl: string }[] = []; // Array to store audio URLs
    mp3DownloadLink: string | null = null;
    userId :UserModule
    searchAPIKey: string = '020a985271msh63da4e188052ac8p1761aajsn6b9e047c9fb3';
    searchAPIHost: string = 'real-time-image-search.p.rapidapi.com';
    searchAPIURL: string = 'https://real-time-image-search.p.rapidapi.com/search';
    exerciseImages: string[] = [];


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

    constructor(private route: ActivatedRoute, private workoutService: WorkoutService, private http: HttpClient,private authService: AuthService) {
      this.authService.getUserInfoFromToken().subscribe(userId => {
        this.userId = userId;
      });
    }


    ngOnInit(): void {
      this.fetchMP3DownloadLink();
      this.workoutPlan = history.state.workoutPlan;
      const navigation = window.history.state;
      this.workoutPlan = navigation.workoutPlan;
      this.intensity = navigation.workoutPlan.intensityLevel;
      console.log('Received workout plan:', this.workoutPlan);
      console.log('Received intensity:', this.intensity);
      this.playAudio();
    }

    fetchExerciseImages(): void {
      this.workoutPlan.exercises.forEach((exercise: any) => {
        this.searchExerciseImage(exercise.workout);
      });

    }

    searchExerciseImage(query: string): void {
      const options = {
        method: 'GET',
        url: this.searchAPIURL,
        params: {
          query: query,
          file_type: "gif"
        },
        headers: {
          'X-RapidAPI-Key': this.searchAPIKey,
          'X-RapidAPI-Host': this.searchAPIHost
        }
      };

      axios.request(options).then((response: any) => {
        if (response.data && response.data.data && response.data.data.length > 0) {
          // Update currentExerciseImage with the URL from the first item in the data array
          this.currentExerciseImage = response.data.data[0].url;
        } else {
          // If no image found, set currentExerciseImage to null
          this.currentExerciseImage = null;
        }
      }).catch((error: any) => {
        console.error('Error searching image:', error);
        // If an error occurs, set currentExerciseImage to null
        this.currentExerciseImage = null;
      });
    }


    startTimer(): void {
      // Check if a workout plan exists and there are exercises to perform
      if (this.workoutPlan && this.workoutPlan.exercises.length > 0) {
        // Fetch image for the first exercise
        const firstExercise = this.workoutPlan.exercises[0];
        this.searchExerciseImage(firstExercise.workout);

        // Add workout session
        this.addWorkoutSession();

        // Start the timer with the second exercise
        this.currentExerciseIndex = 1; // Start with the second exercise
        this.startNextSet(); // Start the timer
        this.playAudio();
        this.fetchMP3DownloadLink();

      } else {
        console.log('No workout plan or exercises to perform.');
      }
    }

    startNextSet(remainingTime?: number): void {
      if (this.workoutPlan && this.currentExerciseIndex < this.workoutPlan.exercises.length) {
        const currentExercise = this.workoutPlan.exercises[this.currentExerciseIndex];
        const totalSets = 4;

        const duration = this.currentInterval === 'exercise' ? this.EXERCISE_DURATION : this.REST_DURATION;
        this.remainingTime = remainingTime !== undefined ? remainingTime : duration;

        // Check if this is the first exercise
        const isFirstExercise = this.currentSet === 0 && this.currentInterval === 'exercise';

        this.timerInterval = setInterval(() => {
          if (this.remainingTime && this.remainingTime > 0) {
            this.remainingTime--;
            this.getTimerClass();
          } else {
            clearInterval(this.timerInterval);
            this.currentInterval = this.currentInterval === 'exercise' ? 'rest' : 'exercise';

            // Check if the interval is an exercise
            if (this.currentInterval === 'exercise') {
              // Increment set count for exercise
              this.currentSet++;

              // Check if all sets for the current exercise are completed
              if (this.currentSet === totalSets) {
                // Reset set count
                this.currentSet = 0;
                this.searchExerciseImage(currentExercise.workout);

                // Move to the next exercise
                this.currentExerciseIndex++;

                // Print the name of the exercise if available
                if (currentExercise && currentExercise.workout && !isFirstExercise) {
                  console.log(`Starting next exercise: ${currentExercise.workout}`);
                }

                // Fetch image for the next exercise
                if (this.currentExerciseIndex < this.workoutPlan.exercises.length) {
                  const nextExercise = this.workoutPlan.exercises[this.currentExerciseIndex];
                  //this.searchExerciseImage(nextExercise.workout);
                }
              } else {
                // Display the first exercise when starting the timer
                if (isFirstExercise && currentExercise && currentExercise.workout) {
                  console.log(`Starting first exercise: ${currentExercise.workout}`);
                  //this.searchExerciseImage(currentExercise.workout);
                }
              }
            }

            // Check if all exercises are completed
            if (this.currentExerciseIndex < this.workoutPlan.exercises.length) {
              const nextDuration = this.currentInterval === 'exercise' ? this.EXERCISE_DURATION : this.REST_DURATION;
              this.startNextSet(nextDuration); // Start next set
            } else {
              // If all exercises are completed, stop the timer
              console.log('Workout plan completed');
            }
          }
        }, 1000);
      }
    }

    stopTimer(): void {
      clearInterval(this.timerInterval);
      this.remainingTime = null;
    }

    getTimerClass(): void {
      if (this.remainingTime !== null) {
        const { alert, warning } = this.COLOR_CODES;
        let remainingPathColor = 'green'; // Default color if not in the alert or warning zone

        if (this.remainingTime <= alert.threshold) {
          remainingPathColor = 'red'; // Change to red if remaining time is below the alert threshold
        } else if (this.remainingTime <= warning.threshold) {
          remainingPathColor = 'orange'; // Change to orange if remaining time is below the warning threshold
        }

        this.timerClass = `base-timer__path-remaining ${remainingPathColor}`;
      }
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

    playAudio(): void {
      const audioPlayer = document.getElementById('audioPlayer') as HTMLAudioElement;
      if (audioPlayer) {
        audioPlayer.play();
      }
    }

    addWorkoutSession(): void {
      // Map intensity levels
      const intensityMap: { [key: string]: string } = {
        'beginner': 'LOW',
        'intermediate': 'MEDIUM',
        'expert': 'HIGH'
      };

      // Convert received intensity level to lowercase
      const receivedIntensityLowercase = this.workoutPlan.intensityLevel.toLowerCase();

      // Check if the received intensity level exists in the intensityMap
      if (receivedIntensityLowercase in intensityMap) {
        // Prepare workout session data with mapped intensity level
        const workoutSessionData = {
          intensity: intensityMap[receivedIntensityLowercase], // Map intensity level
          // Include relevant data for the workout session
        };

        // Call the addWorkoutSession method from the WorkoutService
        this.workoutService.addWorkoutSession(workoutSessionData, this.userId.idUser).subscribe(
          (response) => {
            // Handle success response
            console.log('Workout session added successfully:', response);
          },
          (error) => {
            // Handle error response
            console.error('Error adding workout session:', error);
          }
        );
      } else {
        // Handle case when the received intensity level is not recognized
        console.error('Unrecognized intensity level:', this.intensity);
      }
    }
    async fetchMP3DownloadLink(): Promise<void> {
      const options = {
        method: 'GET',
        url: 'https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/custom/',
        params: {
          url: 'https://www.youtube.com/watch?v=iuCUQQksqkw',
          quality: '64'
        },
        headers: {
          'X-RapidAPI-Key': '13a325e426msh2277f99c6fef7b5p1d0f1djsn1bb5fb4cbef9',
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
  }
