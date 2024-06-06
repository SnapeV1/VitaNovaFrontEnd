import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModule } from './user.module';
import { PeriodTracker } from './PeriodTracker';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class PersonalGoalsModule {

  idPG?: number;
  weightGoal?: number;
  weightStart?: number;
  dateGoal?: Date;
  startDate?: Date;
  description?: string;
  dailyNeededCalories?: number;
  user?: UserModule; 
  tracker?: PeriodTracker;

 }
