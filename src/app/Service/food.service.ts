import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {Food} from "../Models/Foods";
import {FoodCard} from "../Models/FoodCard";
import {Tracker} from "../models/Tracker";
import {MealType} from "../models/MealType";
@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private baseUrl: string = 'http://localhost:8081/RestController'

  constructor(private http: HttpClient) {
  }

  addFood(formData: FormData): Observable<Food> {
    return this.http.post<any>(`${this.baseUrl}/addFood`, formData);
  }

  getFoods(page: number, size: number): Observable<Food[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Food[]>(`${this.baseUrl}/getFood`, {params});
  }

  archiveFood(id: number): Observable<Food> {
    return this.http.delete<Food>(`${this.baseUrl}/archiveFood/${id}`);
  }

  updateFood(formData: FormData, foodId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/updateFood/${foodId}`, formData, {observe: 'response'});
  }


  getFoodById(id: number): Observable<Food> {
    return this.http.get<Food>(`${this.baseUrl}/getFood/${id}`);
  }

  addFoodCards(foods: Food[], quantity: number, mealType: MealType, userId: number): Observable<any> {
    const url = `${this.baseUrl}/ListTracker/${userId}`; // Include userId as a path variable

    // Construct query parameters
    let params = new HttpParams();
    foods.forEach(food => {
      params = params.append('foods', food.id?.toString() ?? ''); // Use optional chaining and nullish coalescing
    });
    params = params.append('quantity', quantity?.toString() ?? '');
    params = params.append('mealType', mealType?.toString() ?? ''); // Use optional chaining and nullish coalescing

    // Make the POST request with the constructed URL and query parameters
    return this.http.post<any>(url, {}, {params}).pipe(
      catchError(error => {
        // Handle errors here
        console.error('Error adding food cards:', error);
        return throwError(error);
      })
    );
  }

  getListEaten(): Observable<FoodCard[]> {
    return this.http.get<FoodCard[]>(`${this.baseUrl}/get-food-cards`);
  }

  deleteFoodCard(foodCard: FoodCard): Observable<any> {
    const url = `${this.baseUrl}/deleteFoodCard`;
    return this.http.delete(url, {body: foodCard});
  }

  updateFoodCards(foods: Food[], quantity: number): Observable<any> {
    const url = `${this.baseUrl}/updateFoodCard/{id}`;

    // Construct query parameters
    let params = new HttpParams();
    foods.forEach(food => {
      params = params.append('foods', food.id); // Assuming 'id' is the property you want to send
    });
    params = params.append('quantity', quantity.toString());

    return this.http.put<any>(url, {}, {params: params});
  }

  addTracker(trackers:Tracker,iduser:number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/addTracker/${iduser}`, trackers);
  }
  addHydration(userId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/addHydration/${userId}`, null);
  }
  getHydrationForToday(userId: number): Observable<any> {
    const url = `${this.baseUrl}/getHydration/${userId}`;
    return this.http.get<any>(url);
  }
  unfillCup(userId: number): Observable<any> {
    // Assuming you make a PUT request to your backend API to unfill the cup
    return this.http.put<any>(`${this.baseUrl}/hydration/${userId}`, {});
  }

}
