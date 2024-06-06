export class PeriodTracker {
  idPeriod!: number;
  startDate: string;
  cycleLength: number;
  symptomRatings: SymptomRating[]; // Change property name to symptomRatings
  mood: string;
  periodLength:number;
  archive: boolean ;
  medications: string;

  constructor(
    startDate: string,
    cycleLength: number,
    symptomRatings: SymptomRating[], // Change property name to symptomRatings
    mood: string,
    periodLength:number,
    archive: boolean = false,
    medications: string,
  ) {
    this.startDate = startDate;
    this.cycleLength = cycleLength;
    this.symptomRatings = symptomRatings; // Change property name to symptomRatings
    this.mood = mood;
    this.periodLength=periodLength;
    this.archive = archive;
    this.medications = medications; // Initialize medications property
  }
}
export class SymptomRating {
  symptom: string;
  rating: number;

  constructor(symptom: string, rating: number) {
    this.symptom = symptom;
    this.rating = rating;
  }
}
