import {Component, Input, ViewChild} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { WorkoutPlan } from '../Models/WorkoutPlan';
import { WorkoutService } from '../Service/workout.service';
import {workoutapi} from "../Models/workoutapi";
import axios from 'axios';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { v4 as uuidv4 } from 'uuid';
import { SessionStorageService } from 'ngx-webstorage';
import { UserModule } from '../Models/user.module';
import { AuthService } from '../Service/auth.service';


@Component({
  selector: 'app-get-plan-user',
  templateUrl: './get-plan-user.component.html',
  styleUrls: ['./get-plan-user.component.css']
})
export class GetPlanUserComponent {
  workoutPlan: WorkoutPlan[] = [];
  baseUrl: string = 'http://localhost:80/uploads/';
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  workoutIdToDelete: number | null = null;
  workoutId: number | null = null;
  workoutPlans: any[] = [];
  selectedMuscle: string = '';
  selectedEquipment: string = '';
  selectedIntensity: string = '';
  userProfile:UserModule;
  @Input() count: number = 50; // Default to 50 stars
  stars: number[] = Array(this.count).fill(0);
  @Input() category: string;
  @Input() categoryIndex: number;
  Userplan!:boolean;
  isLoading: boolean = false;
  freePlanLimit = 4;

  displayedColumns: string[] = ['workout'];
  dataSource: MatTableDataSource<any>;
  imagesList: string[] = [
    'https://i.ibb.co/X38Lw18/8953ef6f-634d-4e72-bb9e-e2b6cf684bce-icegif-475.gif',
    'https://i.ibb.co/hRXhpF9/pexels-zakaria-2827392-1.jpg',
    'https://i.ibb.co/GP7bcPt/88.jpg',
    'https://i.ibb.co/cbHK4tz/12.jpg',
    'https://i.ibb.co/chrGDpN/11.jpg',
    'https://i.ibb.co/jTrJ4DL/4.jpg',
    'https://i.ibb.co/wBV4XVw/6.jpg',
    'https://i.ibb.co/zrk1pX4/9.jpg',
    'https://i.ibb.co/MSy3mjb/8.jpg',
    'https://i.ibb.co/71Gr0Ts/7.jpg',
    'https://i.ibb.co/LrB75Q7/t-l-chargement5.jpg',
    'https://i.ibb.co/W0ypjtj/t-l-chargement3.jpg',
    'https://i.ibb.co/DQLYxrs/t-l-chargement1.jpg',
    'https://i.ibb.co/WcGsnq7/images-3.jpg',
    'https://i.ibb.co/097tKX5/360-F-179817756-Qz-Tocli57q9-G6a1-Oe7k-Jto-MS5d-NMU8cl.jpg',
    'https://i.ibb.co/fDct1N8/images-2.jpg',
    'https://i.ibb.co/DCfkcC9/image1.jpg',
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private workoutService: WorkoutService,
    private router: Router,
    private http: HttpClient,private sessionStorage: SessionStorageService, private authService:AuthService
  ) {
  }

  isDisabled(): void {
    this.Userplan= this.userProfile.plan === 'FREE';
  }

  ngOnInit(): void {
    this.authService.getUserInfoFromToken().subscribe(
      (response: UserModule) => {
        this.userProfile = response;
        console.log(this.userProfile)
        this.isDisabled();
        this.getWorkoutPlan(0, 10); // Fetch user-created workout plans
        // Fetch workout plans from the API
       /* this.fetchWorkoutPlans();
        this.dataSource = new MatTableDataSource(this.filteredWorkoutPlans(this.selectedMuscle));
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;*/
        const storedWorkoutPlans = this.sessionStorage.retrieve('workoutPlans');
        if (storedWorkoutPlans) {
          this.workoutPlans = storedWorkoutPlans;
        } else {
          // Fetch workout plans from the API
          this.fetchWorkoutPlans();
        }
      error => {
        console.error('Error fetching user information:', error);
      }}
    ); 
   
  }

  getWorkoutPlan(page: number, size: number): void {
    this.workoutService.getWorkoutPlan(page, size)
      .subscribe((pageData: any) => {
        if (Array.isArray(pageData.content)) {
          this.workoutPlan = pageData.content;
          this.totalElements = pageData.totalElements;
          this.totalPages = pageData.totalPages;
          this.currentPage = pageData.number;
          // Sanitize image URLs
          this.workoutPlan.forEach(plan => {
            plan.image = this.baseUrl + plan.image;
          });
        } else {
          console.error("Received data is not an array:", pageData.content);
        }
      });
  }

  openTimer(plan: WorkoutPlan): void {
    console.log("Plan ID:", plan.id);
    // Navigate to another route or open a dialog containing the timer and exercise details
    this.router.navigate(['/vitaNova/Timer', plan.id]).then(r => true);
  }
 /* openTimer(plan: WorkoutPlan): void {
    // Navigate to the timer page and pass the workout plan details as route parameters
    this.router.navigate(['/vitaNova/Timer'], { state: { workoutPlan: plan } }).then(r => true);
  }*/

  navigateToTimerPage(workoutPlan: WorkoutPlan): void {
    this.router.navigate(['/vitaNova/timer-api'], { state: { workoutPlan: workoutPlan } });
  }
  deleteWorkout(event: Event, plan: WorkoutPlan): void {
    event.stopPropagation(); // Stop event propagation
    const confirmationMessage = plan.archived
      ? 'Are you sure you want to unarchive this exercise? Title: ' + plan.title
      : 'Are you sure you want to archive this exercise? Title: ' + plan.title;

    if (confirm(confirmationMessage)) {
      // Toggle the archived status
      plan.archived = !plan.archived;

      // Update the archived status on the server
      this.workoutService.deleteWorkout(plan.id).subscribe(
        () => {
          if (plan.archived) {
            this.showAlert('Exercise archived successfully.', 'alert-success');
          } else {
            this.showAlert('Exercise unarchived successfully.', 'alert-success');
          }

          // Remove the deleted workout from the workoutPlan array
          this.workoutPlan = this.workoutPlan.filter(item => item.id !== plan.id);
        },
        (error) => {
          console.error('Error updating exercise:', error);
          this.showAlert('Failed to update exercise status.', 'alert-danger');
          // Revert the toggle if the update fails
          plan.archived = !plan.archived;
        }
      );
    }
  }

  private showAlert(exerciseArchivedSuccessfully: string, alertSuccess: string) {
    // Implement your alert logic here
  }

 /* async fetchWorkoutPlans(): Promise<void> {
    const options = {
      method: 'GET',
      url: 'https://work-out-api1.p.rapidapi.com/search',
      headers: {
        'X-RapidAPI-Key': '2acd7d6738mshdd85e14333aac07p11cf80jsn94660876c278',
        'X-RapidAPI-Host': 'work-out-api1.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      console.log('API Response:', response.data);
      this.workoutPlans = response.data.map((plan: any) => ({
        id: uuidv4(),
        muscle: plan.Muscles,
        workout: plan.WorkOut,
        intensityLevel: plan.Intensity_Level,
        beginnerSets: plan['Beginner Sets'],
        intermediateSets: plan['Intermediate Sets'],
        expertSets: plan['Expert Sets'],
        beginnerReps: plan['Beginner Reps'],
        intermediateReps: plan['Intermediate Reps'],
        expertReps: plan['Expert Reps'],
        breaks: plan.Breaks,
        equipment: plan.Equipments,
        explanation: plan.Explaination
      }));

      console.log('Mapped Workout Plans:', this.workoutPlans);
    } catch (error) {
      console.error('Error fetching workout plans:', error);
      this.workoutPlans = [];
    }
  }*/
  async fetchExercises(): Promise<any[]> {
    const options = {
      method: 'GET',
      url: 'https://work-out-api1.p.rapidapi.com/search',
      headers: {
        'X-RapidAPI-Key': '2acd7d6738mshdd85e14333aac07p11cf80jsn94660876c278',
        'X-RapidAPI-Host': 'work-out-api1.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      return [];
    }
  }

  async fetchWorkoutPlans(): Promise<void> {
    try {
      // Fetch exercises from the API
      const response = await axios.get('https://work-out-api1.p.rapidapi.com/search', {
        headers: {
          'X-RapidAPI-Key': '2acd7d6738mshdd85e14333aac07p11cf80jsn94660876c278',
          'X-RapidAPI-Host': 'work-out-api1.p.rapidapi.com'
        }
      });

      const exercises = response.data;

      // Group exercises into workout plans by muscle type
      const workoutPlansByCategory: { [category: string]: any[] } = {};
      exercises.forEach((exercise: any) => {
        const muscleType = exercise.Muscles; // Assuming 'Muscles' is the muscle type attribute
        if (!workoutPlansByCategory[muscleType]) {
          workoutPlansByCategory[muscleType] = [];
        }
        workoutPlansByCategory[muscleType].push(exercise);
      });
      const shuffledExercises = exercises.sort(() => Math.random() - 0.5);

      // Create workout plans with a variety of exercises
      const numWorkoutPlans = Math.ceil(shuffledExercises.length / 10);
      for (let i = 0; i < numWorkoutPlans; i++) {
        const start = i * 10;
        const end = Math.min(start + 10, shuffledExercises.length);

        const workoutPlanExercises = shuffledExercises.slice(start, end);

        // Randomly select an image from the imagesList
        const randomImageIndex = Math.floor(Math.random() * this.imagesList.length);
        const randomImage = this.imagesList[randomImageIndex];

        // Assign intensity level to the workout plan based on a predetermined scheme
        const intensityLevels =["Beginner", "Intermediate", "Expert"]; // Example intensity levels
        const randomIntensityIndex = i % intensityLevels.length; // Cycle through intensity levels
        const intensityLevel = intensityLevels[randomIntensityIndex];

        const workoutPlan = {
          id: uuidv4(),
          title: `Workout Plan ${i + 1}`, // Example title
          image: randomImage, // Assign the randomly selected image
          intensityLevel: intensityLevel, // Assign intensity level to the workout plan
          exercises: workoutPlanExercises.map((exercise: any) => ({
            muscle: exercise.Muscles,
            workout: exercise.WorkOut,
            beginnerSets: exercise['Beginner Sets'],
            intermediateSets: exercise['Intermediate Sets'],
            expertSets: exercise['Expert Sets'],
            beginnerReps: exercise['Beginner Reps'],
            intermediateReps: exercise['Intermediate Reps'],
            expertReps: exercise['Expert Reps'],
            breaks: exercise.Breaks,
            equipment: exercise.Equipments,
            explanation: exercise.Explaination,
            video: exercise.Video
          }))
        };

        this.workoutPlans.push(workoutPlan);
      }

      // Convert grouped exercises into workout plans by category
      for (const category in workoutPlansByCategory) {
        if (workoutPlansByCategory.hasOwnProperty(category)) {
          const categoryExercises = workoutPlansByCategory[category];
          const numCategoryWorkoutPlans = Math.ceil(categoryExercises.length / 10); // Each workout plan contains 10 exercises
          for (let i = 0; i < numCategoryWorkoutPlans; i++) {
            const start = i * 10;
            const end = Math.min(start + 10, categoryExercises.length);

            const workoutPlanExercises = categoryExercises.slice(start, end);

            // Randomly select an image from the imagesList
            const randomImageIndex = Math.floor(Math.random() * this.imagesList.length);
            const randomImage = this.imagesList[randomImageIndex];

            // Assign intensity level to the workout plan based on a predetermined scheme
            const intensityLevels = ["Beginner", "Intermediate", "Expert "]; // Example intensity levels
            const randomIntensityIndex = i % intensityLevels.length; // Cycle through intensity levels
            const intensityLevel = intensityLevels[randomIntensityIndex];

            const workoutPlan = {
              id: uuidv4(),
              category: category,
              title: `Workout Plan ${i + 1} (${category})`, // Example title including category
              image: randomImage, // Assign the randomly selected image
              intensityLevel: intensityLevel, // Assign intensity level to the workout plan
              exercises: workoutPlanExercises.map((exercise: any) => ({
                muscle: exercise.Muscles,
                workout: exercise.WorkOut,
                beginnerSets: exercise['Beginner Sets'],
                intermediateSets: exercise['Intermediate Sets'],
                expertSets: exercise['Expert Sets'],
                beginnerReps: exercise['Beginner Reps'],
                intermediateReps: exercise['Intermediate Reps'],
                expertReps: exercise['Expert Reps'],
                breaks: exercise.Breaks,
                equipment: exercise.Equipments,
                explanation: exercise.Explaination,
                video: exercise.Video
              }))
            };

            this.workoutPlans.push(workoutPlan);
          }
        }
      }
      this.sessionStorage.store('workoutPlans', this.workoutPlans);

      console.log('Generated Workout Plans:', this.workoutPlans);
    } catch (error) {
      console.error('Error fetching workout plans:', error);
      this.workoutPlans = []; // Clear plans if an error occurs
    }
  }






  // Method to filter workout plans by muscle category
  filteredWorkoutPlans(category: string): any[] {
    const filteredPlans = this.workoutPlans.filter(plan => plan.category === category);
    // this.fetchImagesForWorkoutPlans(); // Call fetchImagesForWorkoutPlans after updating workout plans
    return filteredPlans;

  }

  // Method to extract unique muscle categories from the list of plans
  get uniqueMuscleCategories(): string[] {
    return [...new Set(this.workoutPlans.map(plan => plan.category))];
  }

  scrollLeft(): void {
    const scrollContainer = document.querySelector('.scroll-images');
    if (scrollContainer) {
      scrollContainer.scrollBy({
        left: -200, // Adjust scroll distance as needed
        behavior: 'smooth'
      });
    }
  }

  scrollRight(): void {
    const scrollContainer = document.querySelector('.scroll-images');
    if (scrollContainer) {
      scrollContainer.scrollBy({
        left: 200, // Adjust scroll distance as needed
        behavior: 'smooth'
      });
    }
  }

  async applyFilters(): Promise<void> {
    const options = {
      method: 'GET',
      url: 'https://work-out-api1.p.rapidapi.com/search',
      params: {},
      headers: {
        'X-RapidAPI-Key': '2acd7d6738mshdd85e14333aac07p11cf80jsn94660876c278',
        'X-RapidAPI-Host': 'work-out-api1.p.rapidapi.com'
      }
    };

    // Add selected filters to the request parameters
    if (this.selectedMuscle) {
      options.params['Muscles'] = this.selectedMuscle;
    }
    if (this.selectedEquipment) {
      options.params['Equipments'] = this.selectedEquipment;
    }
    if (this.selectedIntensity) {
      options.params['Intensity_Level'] = this.selectedIntensity;
    }

    try {
      const response = await axios.request(options);
      console.log('Filtered API Response:', response.data);
      // Update the workoutPlans array with the filtered data
      this.workoutPlans = response.data.map((plan: any) => ({
        id: uuidv4(),
        muscle: plan.Muscles,
        workout: plan.WorkOut,
        intensityLevel: plan.Intensity_Level,
        beginnerSets: plan['Beginner Sets'],
        intermediateSets: plan['Intermediate Sets'],
        expertSets: plan['Expert Sets'],
        beginnerReps: plan['Beginner Reps'],
        intermediateReps: plan['Intermediate Reps'],
        expertReps: plan['Expert Reps'],
        breaks: plan.Breaks,
        equipment: plan.Equipments,
        explanation: plan.Explaination
      }));
      // this.fetchImagesForWorkoutPlans();

    } catch (error) {
      console.error('Error fetching filtered workout plans:', error);
      this.workoutPlans = []; // Clear plans if an error occurs
    }
  }

  scrollPlans(direction: string, index: number) {
    const containers = document.querySelectorAll('.workout-scroll-container');
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
