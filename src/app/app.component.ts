import { Component } from '@angular/core';
import { PeriodTrackerServiceService } from './Service/period-tracker-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'VitaNova';
  constructor(private periodTrackerService: PeriodTrackerServiceService) {
}
}
