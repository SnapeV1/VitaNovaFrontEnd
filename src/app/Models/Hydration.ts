import {Tracker} from "../models/Tracker";

export class Hydration {
  id!:number;
  cupsQty!: number;
  sumOfWater!: number;
  notification!: string;
  date!:Date;
  archive!: boolean;
  tracker!: Tracker;
}
