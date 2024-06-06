import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Community } from '../Community';
export enum Gender {
  MALE = 'MAN',
  FEMALE = 'WOMAN'
}

export enum ERole {
  ROLE_USER = 'USER',
  ROLE_ADMIN = 'ROLE_ADMIN'
}


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class UserModule { 
  idUser!: number;  // Example initial value
  username!: string ;
  firstName!: string ;
  lastName!: string ;
  dateOfBirth!: Date ; // Example initial value
  gender!: Gender ; // Example initial value
  email!: string ;
  weight!: number ; // Example initial value
  height!: number ; // Example initial value
  password!: string ;
  archive!: boolean ;
  picture!: string ;
  
  // personalGoals: PersonalGoals = new PersonalGoals(); // Example initial value
  // periodTracker: PeriodTracker = new PeriodTracker(); // Example initial value
  // cart: Cart = new Cart(); // Example initial value
  // foods: Food[] = [];
  communities: Community;
  role!: ERole ; // Example initial value

  constructor() {
    
  }

}
