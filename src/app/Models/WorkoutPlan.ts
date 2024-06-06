// workout-program.mode

import {Exercise} from "./Exercise";
import {Intensity} from "./Intensity";

export class WorkoutPlan {
  id!: number;
  userId!: number; // Add user ID field
  title!: string;
  intensity!: Intensity; // You can define an enum in Angular for Intensity if needed
  duration!: string;
  restIntervals!: string;
  sportType!: string;
  progression!: string;
  image!: string;
  archived!: boolean;
  exercises!: Exercise[];
}
