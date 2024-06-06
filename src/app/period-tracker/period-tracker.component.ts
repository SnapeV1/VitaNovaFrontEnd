import { Component, ViewChild, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { PeriodTrackerServiceService } from '../Service/period-tracker-service.service';
import { PeriodTracker, SymptomRating } from '../Models/PeriodTracker';
import { DateRange } from '@angular/material/datepicker';
import { ElementRef } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-period-tracker',
  templateUrl: './period-tracker.component.html',
  styleUrls: ['./period-tracker.component.css']
})
export class PeriodTrackerComponent implements OnInit {
  @ViewChild('picker') picker!: MatDatepicker<Date>;
  selectedDate: string = ''; // Change property name to symptomRatings

  symptomRatings: SymptomRating[] = [];
  mood: string = '';
  periodTracker: PeriodTracker | null = null;
  idPeriod!: number;
  submitted = false; // Define submitted property
  selectedDateRange: DateRange<Date> | undefined;
  today: Date = new Date();
  dateErrorMessage: string = '';
  symptomErrorMessage: string = '';
  moodErrorMessage: string = '';
  //medicationErrorMessage: string = '';

  periodLength: number = 0;
  periodLengthErrorMessage: string = '';
  selectedCycleLength: string = '28 Days';
  currentPage: number = 0;
  totalOptions!: number; // Definite assignment assertion modifier
  pageSize: number =6/2;
  selectedMedication: string = ''; // Property to store selected medication

// Method to handle medication selection
onMedicationSelect(medication: string) {
  this.selectedMedication = medication;
  console.log("Selected medication:", medication);

}


  @Output() moodChange: EventEmitter<string> = new EventEmitter<string>();

  onMoodChange(event: any) {
    const selectedMood = event.target.value;
    console.log("Selected mood:", selectedMood);
    this.moodChange.emit(selectedMood); // Emitting the selected mood
    this.mood = selectedMood; // Update the mood property directly

  }

  constructor(
    private periodTrackerService: PeriodTrackerServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    this.cdr.detectChanges();

    const radioInputs = document.querySelectorAll('.options input[type="radio"]');
  const selectedElement = document.querySelector('.selected');

  radioInputs.forEach(input => {
    input.addEventListener('change', () => {
      const selectedLabel = input.nextElementSibling?.getAttribute('data-txt');
      if (selectedLabel && selectedElement) {
        selectedElement.setAttribute('data-default', selectedLabel);
        this.selectedCycleLength = selectedLabel;
      }
    });
  });

  this.totalOptions = this.elementRef.nativeElement.querySelectorAll('.optionet').length;
  this.showPage(this.currentPage);
  this.setupPagination();










    this.route.params.subscribe(params => {
      this.idPeriod = +params['idPeriod'];
      if (this.idPeriod) {
        this.getPeriodTrackerById(this.idPeriod);
      }
      this.selectedDateRange = new DateRange<Date>(null, null);


    });
  }

  handleDateChange(dateRange: DateRange<Date>): void {
    // Update selectedDateRange when the date changes
    this.selectedDateRange = dateRange;
  }

  getRecipes(): void {
    // Navigate to PeriodInsightsComponent with the period ID as a query parameter
    this.router.navigate(['vitaNova/ShowPeriodInformation']);
  }


  getPeriodTrackerById(idPeriod: number): void {
    if (!this.symptomRatings) {
      this.symptomRatings = [];
    }
    this.periodTrackerService.getPeriodTrackerById(idPeriod)
      .subscribe(periodTracker => {
        this.periodTracker = periodTracker;
        this.selectedDateRange = new DateRange<Date>(new Date(periodTracker.startDate), null);
        this.mood = periodTracker.mood;
        this.periodLength = periodTracker.periodLength;
        this.selectedMedication=periodTracker.medications;
        this.selectedCycleLength = periodTracker.cycleLength + ' Days'; // Assuming cycleLength is a number


         // Populate selected symptoms and their ratings
      this.selectedSymptoms = {}; // Clear existing values
      periodTracker.symptomRatings.forEach(symptomRating => {
        this.selectedSymptoms[symptomRating.symptom] = symptomRating.rating;
      });

// Call getSymptomsAndRatingsForPeriod to fetch symptom ratings
this.periodTrackerService.getSymptomsAndRatingsForPeriod(idPeriod)
.subscribe(symptomRatings => {
  console.log('Symptom Ratings:', symptomRatings); // Log symptom ratings to check if data is received

  this.symptomRatings = symptomRatings;


  // Prefill symptoms and ratings
  this.prefillSymptomsAndRatings();

}, error => {
  console.error('Error fetching symptoms and ratings:', error);
});


        const selectedMood = periodTracker.mood;
      const moodInput = document.querySelector(`input[value="${selectedMood}"]`) as HTMLInputElement;
      if (moodInput) {
        moodInput.checked = true;}


        const selectedMedication = periodTracker.medications;
      const medicationInput = document.querySelector(`input[value="${selectedMedication}"]`) as HTMLInputElement;
      if (medicationInput) {
        medicationInput.checked = true;
      }


  });
}


prefillSymptomsAndRatings(): void {
  this.symptomRatings.forEach(sr => {
    const symptomCheckbox = document.querySelector(`input[name="${sr.symptom}"]`) as HTMLInputElement;
    if (symptomCheckbox) {
      symptomCheckbox.checked = true;
      // Optionally, you can update UI to display ratings or perform any other actions based on symptom ratings
    }
  });
}
  // Inside your component class

updateSelectedCycleLength(selectedLength: string): void {
  this.selectedCycleLength = selectedLength;
}



handleSymptomChange(symptom: string, eventOrRating: Event | number): void {
  if (typeof eventOrRating === 'number') {
    // This branch is executed when a rating is directly passed
    const existingRatingIndex = this.symptomRatings.findIndex(sr => sr.symptom === symptom);
    if (existingRatingIndex !== -1) {
      // If a rating for the symptom already exists, update it
      this.symptomRatings[existingRatingIndex].rating = eventOrRating;
    } else {
      // If a rating for the symptom does not exist, add it to the array
      this.symptomRatings.push(new SymptomRating(symptom, eventOrRating));
    }
  } else {
    // This branch is executed when a change event is passed
    const isChecked = (eventOrRating.target as HTMLInputElement)?.checked ?? false;
    if (isChecked) {
      // Add the symptom with a default rating of 0
      const existingRatingIndex = this.symptomRatings.findIndex(sr => sr.symptom === symptom);
      if (existingRatingIndex === -1) {
        // If a rating for the symptom does not exist, add it to the array
        this.symptomRatings.push(new SymptomRating(symptom, 0));
      }
    } else {
      // Remove the symptom rating from the array
      const existingRatingIndex = this.symptomRatings.findIndex(sr => sr.symptom === symptom);
      if (existingRatingIndex !== -1) {
        this.symptomRatings.splice(existingRatingIndex, 1);
      }
    }
  }

  // Check if there are any selected symptoms
  if (this.symptomRatings.length === 0) {
    this.symptomErrorMessage = 'Please select at least one symptom.';
  } else {
    this.symptomErrorMessage = ''; // Clear error message if symptoms are selected
  }
}
formatDate(date: Date): string {
  // Format the date as yyyy-MM-dd
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

updateSymptomRatings(updatedSymptomRatings: SymptomRating[]) {
  if (this.periodTracker) {
    this.periodTracker.symptomRatings = updatedSymptomRatings;
  }
}


saveInformation() {
  this.dateErrorMessage = '';
  this.symptomErrorMessage = '';
  this.moodErrorMessage = '';
  this.periodLengthErrorMessage = '';
  //this.medicationErrorMessage='';

  const updatedSymptomRatings = [...this.symptomRatings];

  const formattedStartDate = this.selectedDateRange?.start ?
      this.formatDate(this.selectedDateRange.start) : '';

  // Validate period length
  if (this.periodLength <= 0) {
      this.periodLengthErrorMessage = 'Period length must be greater than 0.';
      return;
  }

  // Validate selected date
  if (!this.selectedDateRange || !this.selectedDateRange.start) {
      this.dateErrorMessage = 'Please select a valid start date.';
      return;
  }

  // Validate selected symptoms
  if (this.symptomRatings.length === 0) {
      this.symptomErrorMessage = 'Please select at least one symptom.';
      return;
  }

  // Validate mood
  if (!this.mood) {
      this.moodErrorMessage = 'Please select a mood.';
      return;
  }

  // Validate selected medication
 /* if (!this.selectedMedication) {
    this.medicationErrorMessage = ('Please select a medication or any if you re not having them.');
      return;
  }*/

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!this.selectedDateRange || !this.selectedDateRange.start) {
    this.dateErrorMessage = 'Please select a date.';
    return;
}


  const twoYearsAgo = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());
  twoYearsAgo.setHours(0, 0, 0, 0);

  // Validate selected date against two years ago and future dates
  if (this.selectedDateRange.start < twoYearsAgo) {
      this.dateErrorMessage = 'Selected date should not be over 2 years ago.';
      return;
  }
  if (this.selectedDateRange.start > today) {
      this.dateErrorMessage = 'Selected date should not be in the future.';
      return;
  }




    if (this.selectedDateRange) {
        // Extract the start date from the selected date range
        const startDate = this.selectedDateRange?.start ?
            this.selectedDateRange.start.toLocaleDateString('en-US', { timeZone: 'Africa/Tunis' }) : '';
            console.log('Start Date:', startDate);
        if (this.idPeriod) {
            // Update existing PeriodTracker
            const cycleLength = this.selectedCycleLength;
            console.log('Cycle Length:', cycleLength);
            const updatedPeriodTracker = new PeriodTracker(
              formattedStartDate,
                parseInt(cycleLength),
                updatedSymptomRatings,
                this.mood,
                this.periodLength ,
                false,
                this.selectedMedication
            );console.log('Updated Symptom Ratings:', updatedSymptomRatings);

            this.periodTrackerService.updatePeriodInformation(updatedPeriodTracker, this.idPeriod)
            .subscribe(() => {
              console.log('Period Tracker information updated successfully');
              this.updateSymptomRatings(updatedSymptomRatings); // Call updateSymptomRatings
              this.router.navigate(['vitaNova/ShowPeriodInformation']);
            }, error => {
              console.error('Error updating Period Tracker information:', error);
            });
        } else {
            // Add new PeriodTracker
            const cycleLength = this.selectedCycleLength;
            const lastPeriodStartDate = this.selectedDateRange?.start ?
            this.selectedDateRange.start.toLocaleDateString('en-US', { timeZone: 'Africa/Tunis' }) : '';


            console.log('Cycle Length:', cycleLength);
            console.log('Last Period Start Date:', formattedStartDate);
            console.log('Symptoms:', this.symptomRatings);
            console.log('Mood:', this.mood);
            console.log('periodLength:', this.periodLength);
            console.log('medication:', this.selectedMedication);


            const periodTracker = new PeriodTracker(
                formattedStartDate,
                parseInt(cycleLength),
                this.symptomRatings,
                this.mood,
                this.periodLength ,
                false,
                this.selectedMedication
            );

            this.periodTrackerService.addPeriodInformation(periodTracker).subscribe(response => {
                console.log('Period Tracker information added successfully:', response);
                this.router.navigate(['vitaNova/ShowPeriodInformation']);
            }, error => {
                console.error('Error adding Period Tracker information:', error);
            });

            // Reset values and close the picker
            this.symptomRatings = [];
            this.mood = '';
            this.picker.close();
        }
    } else {
        console.error('No date range selected.');
    }
}

  selectedSymptoms: { [key: string]: number } = {
    'Headache': 0,
    'Fatigue': 0,
    'Cramps': 0,
    'Mood Swings': 0,
    'Nausea': 0
  };
//page pagination
showPage(page: number) {
  const options = this.elementRef.nativeElement.querySelectorAll('.optionet') as HTMLElement[];
  options.forEach(optionet => optionet.style.display = 'none');

  for (let i = page * this.pageSize; i < (page + 1) * this.pageSize && i < this.totalOptions; i++) {
    options[i].style.display = 'block';
  }
}



setupPagination() {
  const leftButton = this.elementRef.nativeElement.querySelector('.paginate.left');
  leftButton.addEventListener('click', () => {
    this.handlePagination(-1);
  });

  const rightButton = this.elementRef.nativeElement.querySelector('.paginate.right');
  rightButton.addEventListener('click', () => {
    this.handlePagination(1);
  });

  this.updatePaginationState();
}

handlePagination(offset: number) {
  const newPage = this.currentPage + offset;
  const totalPages = Math.ceil(this.totalOptions / this.pageSize);
  if (newPage >= 0 && newPage < totalPages) {
    this.currentPage = newPage;
    this.showPage(this.currentPage);
    this.updatePaginationState();
  }
}

updatePaginationState() {
  const leftButton = this.elementRef.nativeElement.querySelector('.paginate.left');
  const rightButton = this.elementRef.nativeElement.querySelector('.paginate.right');

  const totalPages = Math.ceil(this.totalOptions / this.pageSize);
  leftButton.setAttribute('data-state', this.currentPage === 0 ? 'disabled' : '');
  rightButton.setAttribute('data-state', this.currentPage === totalPages - 1 ? 'disabled' : '');
}}
