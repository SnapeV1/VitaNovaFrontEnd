import {UserModule} from "./user.module";

export class WorkoutSession {
  id!: number;
  time_start!: Date;
  time_end!: Date;
  intensity!: string; // Assuming Intensity is a string enum in the backend
  user: UserModule  ; // Assuming you have a User interface or class defined
}
