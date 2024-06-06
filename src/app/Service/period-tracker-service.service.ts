import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PeriodTracker } from '../Models/PeriodTracker';
import { map } from 'rxjs/operators';
import { SymptomRating } from '../Models/PeriodTracker';
import { Exercise } from '../Models/Exercise'; // Make sure to import the Exercise model
import { Food } from '../Models/Foods';
import { JournalEntry } from '../Models/JournalEntry';




@Injectable({
  providedIn: 'root'
})
export class PeriodTrackerServiceService {
  private baseUrl='http://localhost:8081/PeriodTracker/';
  private apiUrl = 'https://chatgpt-gpt4-ai-chatbot.p.rapidapi.com/ask';

  constructor(private http: HttpClient) {}

  // Method to add period information
  addPeriodInformation(periodTracker: PeriodTracker): Observable<PeriodTracker> {
    return this.http.post<PeriodTracker>(this.baseUrl + 'AddPeriodInformation', periodTracker);
  }

  getPeriodTracker(): Observable<PeriodTracker[]> {
    return this.http.get<PeriodTracker[]>(this.baseUrl + 'getPeriodTracker');
  }
  updatePeriodInformation(updatedPeriodTracker: PeriodTracker, idPeriod: number): Observable<PeriodTracker> {
    return this.http.put<PeriodTracker>(`${this.baseUrl}UpdatePeriodinformation?idPeriod=${idPeriod}`, updatedPeriodTracker);
  }
  getPeriodTrackerById(idPeriod: number): Observable<PeriodTracker> {
    return this.http.get<PeriodTracker>(`${this.baseUrl}getPeriodTrackerById/${idPeriod}`);
  }
  
  archivePeriod(idPeriod: number): Observable<string> {
    return this.http.put(`${this.baseUrl}archivePeriod?idPeriod=${idPeriod}`, null, { responseType: 'text' })
      .pipe(
        map(() => 'archived')
      );
  }
  getNonArchivedPeriodTrackers(): Observable<PeriodTracker[]> {
    return this.http.get<PeriodTracker[]>(`${this.baseUrl}nonArchivedPeriodTrackers`);
  }
  getSymptomsAndRatingsForPeriod(idPeriod: number): Observable<SymptomRating[]> {
    return this.http.get<SymptomRating[]>(`${this.baseUrl}getSymptomsAndRatingsForPeriod/${idPeriod}`);
  }
  triggerScheduler(): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}triggerScheduler`, {});
  }

  // Method to calculate cycle phase
  calculateCyclePhase(periodTrackerId: number): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}calculateCyclePhase/${periodTrackerId}`);
  }
// Method to calculate the next period date
calculateNextPeriodDate(periodTracker: PeriodTracker, idPeriod: number): Observable<string> {
  return this.http.get<string>(`${this.baseUrl}${idPeriod}/next-period-date`);
}

// Method to calculate the ovulation date
calculateOvulationDate(periodTracker: PeriodTracker, idPeriod: number): Observable<string> {
  return this.http.get<string>(`${this.baseUrl}${idPeriod}/ovulation-date`);
}


askQuestionToChatbot(question: string): Observable<any> {
  const headers = new HttpHeaders({
    'content-type': 'application/json',
    'X-RapidAPI-Key': '020a985271msh63da4e188052ac8p1761aajsn6b9e047c9fb3',
    'X-RapidAPI-Host': 'chatgpt-gpt4-ai-chatbot.p.rapidapi.com'
  });

  const body = JSON.stringify({ query: question });

  return this.http.post<any>(this.apiUrl, body, { headers });
}
getPeriodExercises(): Observable<Exercise[]> {
  return this.http.get<Exercise[]>(`${this.baseUrl}exercises`);
}

getPeriodFood(): Observable<Food[]> {
  return this.http.get<Food[]>(`${this.baseUrl}period-food`);
}


getFertileWindow(idPeriod: number): Observable<Date[]> {
  return this.http.get<Date[]>(`${this.baseUrl}fertile-window/${idPeriod}`);
}
addJournalEntry(journalEntry: JournalEntry): Observable<JournalEntry> {
  return this.http.post<JournalEntry>(`${this.baseUrl}AddJournal`, journalEntry);
}
}


