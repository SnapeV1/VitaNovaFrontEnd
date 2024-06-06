import { Component, OnInit } from '@angular/core';
import { PeriodTrackerServiceService } from '../Service/period-tracker-service.service';
import { PeriodTracker } from '../Models/PeriodTracker';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-show-period',
  templateUrl: './show-period.component.html',
  styleUrls: ['./show-period.component.css']
})
export class ShowPeriodComponent implements OnInit {
  periodTrackers: PeriodTracker[] = [];
  currentCyclePhase: string = ""; // Variable to store the fetched cycle phase



  constructor(private periodTrackerService: PeriodTrackerServiceService,
              private router: Router) { }



  ngOnInit(): void {

    this.getPeriodTrackers();
  }

 getPeriodTrackers(): void {
  this.periodTrackerService.getNonArchivedPeriodTrackers()
    .subscribe(periodTrackers => this.periodTrackers = periodTrackers);
}

  updatePeriodInformation(periodTrackerId: number): void {
    if (periodTrackerId) {
      // Navigate to PeriodTrackerComponent with the period tracker ID as a route parameter
      this.router.navigate(['vitaNova/PeriodInformation', periodTrackerId]);
    }
  }

  getCyclePhase(idPeriod: number): void {
    if (idPeriod) {
      // Navigate to PeriodInsightsComponent with the period ID as a query parameter
      this.router.navigate(['vitaNova/PeriodInsights'], { queryParams: { id: idPeriod } });
    }
  }
  archivePeriod(idPeriod: number): void {
    this.periodTrackerService.archivePeriod(idPeriod)
      .subscribe(response => {
        console.log('Period Tracker archived successfully:', response);

        // Remove the archived period tracker from the list
        this.periodTrackers = this.periodTrackers.filter(pt => pt.idPeriod !== idPeriod);

      }, error => {
        console.error('Error archiving Period Tracker:', error);
      });
  }}
