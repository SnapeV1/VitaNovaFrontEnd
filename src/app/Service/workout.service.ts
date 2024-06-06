import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {Exercise} from "../Models/Exercise";
import {UserRating} from "../Models/UserRating";
import {WorkoutPlan} from "../Models/WorkoutPlan";
import {Intensity} from "../Models/Intensity";

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  //private baseUrl: string = 'https://096c-197-14-236-90.ngrok-free.app/RestController';
  private baseUrl: string = 'http://localhost:8081/RestController';
 //private baseUrl: string = 'https://70b2-197-14-236-90.ngrok-free.app.ngrok.io/RestController';
  private readonly apiUrl = 'https://spotify-scraper.p.rapidapi.com/v1/track/download';



  constructor(private http: HttpClient) {
  }

  /*addExercise(exercise: Exercise): Observable<Exercise> {
    return this.http.post<Exercise>(this.baseUrl + 'addExercise', Exercise)

  }
*/
  // Update the addExercise method in the WorkoutService
  // Update the addExercise method in the WorkoutService
  /*addExercise(data: Exercise | FormData): Observable<any> {
    if (data instanceof FormData) {
      return this.http.post(`${this.baseUrl}addExercise`, data);
    } else {
      const formData = new FormData();
      const exerciseData = data as Exercise; // Type assertion
      for (const key in exerciseData) {
        if (exerciseData.hasOwnProperty(key)) {
          formData.append(key, (exerciseData as any)[key] as string); // Type assertion for data[key]
        }
      }
      return this.http.post(`${this.baseUrl}addExercise`, formData);
    }*/
  addExercise(exercise: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/addExercise`, exercise, {observe: 'response'});
  }

  getExercises(page:number,size:number): Observable<Exercise[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Exercise[]>(`${this.baseUrl}/GetExercise`,{params});

  }

  deleteExercise(exerciseId: number): Observable<void> {
    const url = `${this.baseUrl}/ArchiverExercise/${exerciseId}`;
    return this.http.delete<void>(url);
  }

  updateExercise(formData: FormData, exerciseId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/UpdateExercise/${exerciseId}`, formData, { observe: 'response' });
  }
  getActiveExercises(page:number,size:number): Observable<Exercise[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Exercise[]>(`${this.baseUrl}/GetActiveExercise`,{params});}
  rateExercise(exerciseId: number, rate: number) {
    return this.http.post(`${this.baseUrl}/rateExercise/${exerciseId}/${rate}`,{});
  }
  saveUserExerciseRating(userExerciseRating: UserRating, idEx: number, idUser: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/saveUserExerciseRating/${idEx}/${idUser}`, userExerciseRating);
  }
  getExerciseById(exerciseId: number): Observable<Exercise> {
    return this.http.get<Exercise>(`${this.baseUrl}/getExerciseById/${exerciseId}`);
  }
  getAverageRating(exerciseId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/Rating/${exerciseId}`);
  }
  searchExercises(bodyPart: string, searchText: string,page: number, size: number): Observable<Exercise[]> {
      const params = new HttpParams()
        .set('bodyPart', bodyPart || '')
        .set('searchText', searchText || '')
        .set('page', page.toString())
        .set('size', size.toString());
    return this.http.get<Exercise[]>(`${this.baseUrl}/searchEx`, { params });
  }
  addPlan(workoutplan: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/addPlan`, workoutplan, {observe: 'response'});
  }
  getActiveExercisesFiltered(page: number, size: number, bodyParts: string[]): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('bodyPart', bodyParts.join(',')); // Combine multiple body parts into one string

    return this.http.get<any>(`${this.baseUrl}/filtered`, { params });
  }
  getExercisesSortedByRating(page: number, size: number): Observable<Exercise[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.baseUrl}/sorted-by-rating`,{ params });
  }
  getWorkoutPlan(page:number,size:number): Observable<WorkoutPlan[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<WorkoutPlan[]>(`${this.baseUrl}/GetPlan`,{params});}

  getWorkoutPlanById(workoutId: number): Observable<WorkoutPlan> {
    return this.http.get<WorkoutPlan>(`${this.baseUrl}/getPlan/${workoutId}`);
  }
  deleteWorkout(WorkoutId: number): Observable<void> {
    const url = `${this.baseUrl}/ArchiverPlan/${WorkoutId}`;
    return this.http.delete<void>(url);
  }
  addWorkoutSession(workoutSession: any, userId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/addworkoutsession/${userId}`, workoutSession);
  }
  addSession(workoutSession: any, id: number, intensity: Intensity): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/addSession/${id}/${intensity}`, workoutSession);
  }
  getUserTrainingStatistics(userId: number): Observable<any> {
    const url = `${this.baseUrl}/statistique/${userId}`;
    return this.http.get<any>(url).pipe(
        catchError(error => {
          console.error('Error fetching user training statistics:', error);
          return throwError(error);
        })
    );
  }
  getAllWorkoutSessionData(id: number): Observable<Object[]> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<Object[]>(`${this.baseUrl}/statistics`, { params });
  }

}

