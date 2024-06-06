import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Tracker } from '../models/Tracker';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TrackerService {
  private baseUrl : string = 'http://localhost:8081/RestController'
  constructor(private http : HttpClient) { }
  addTracker(tracker : Tracker):Observable<Tracker>{
    return this.http.post<Tracker>(this.baseUrl + 'addTracker',tracker) }

}
