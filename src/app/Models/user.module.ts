import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Community } from '../Model/Community';
import { PersonalGoalsModule } from './personal-goals.module';
import { Food } from './Foods';
export enum Gender {
  MALE = 'MAN',
  FEMALE = 'WOMAN'
}
/*
export enum ERole {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN'
}*/
export enum ERole {
  ROLE_USER = 'USER',
  ROLE_ADMIN = 'ADMIN'
}
export enum Plan {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM'
}




@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class UserModule {
  [key: string]: any; // Index signature allowing any string key with any value

  idUser!: number;  
  username!: string ;
  firstName!: string ;
  lastName!: string ;
  dateOfBirth!: Date ; 
  gender!: Gender ; 
  email!: string ;
  weight!: number ; 
  height!: number ; 
  password!: string ;
  archive!: boolean ;
  picture!: string ;
  verified!: boolean ;
  score!:number;
  phone!: string ;
  facebook!:string;
   personalGoals: PersonalGoalsModule = null; 
  // periodTracker: PeriodTracker = new PeriodTracker(); // Example initial value
  // cart: Cart = new Cart(); // Example initial value
   foods: Food[] = [];
  communities: Community;
  plan!: Plan ; 
  role!: ERole ; 

  constructor() {

  }

}
