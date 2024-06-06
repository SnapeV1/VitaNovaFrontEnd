import {Intensity} from "./Intensity";
export class Exercise {
  id !: number;
  title!: string;
  description !: string;
  typeEx  !: string;
  bodypart!: string;
  intensity!: Intensity;
  sets!: string;
  reps!: string;
  picture!: string;
  archived!:boolean;
  rating!:number;


}
/*
=======
export class Exercise {
    id!: number;
    title: string;
    description: string;
    typeEx: string;
    bodypart: string;
    intensity: Intensity;
    sets: string;
    reps: string;




    constructor(
        id: number,
        title: string,
        description: string, // Change property name to symptomRatings
        typeEx: string,
        bodypart:string,
        intensity: Intensity,
        sets: string,
        reps:string,
      ) {
        this.id = id;
        this.title = title;
        this.description = description; // Change property name to symptomRatings
        this.typeEx = typeEx;
        this.bodypart=bodypart;
        this.intensity = intensity;
        this.sets = sets;
        this.reps = reps; // Initialize medications property
      }
 // Make sure to import PeriodTracker model if needed
  }

  export enum Intensity {
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW',
  }
>>>>>>> origin/sheima*/
