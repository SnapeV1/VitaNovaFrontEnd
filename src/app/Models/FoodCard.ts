import { Food } from '../Models/Foods';
import {float} from "@zxing/library/es2015/customTypings";

export class FoodCard {
    foodId!: number;
    quantity!: number;
    calcCalories!:number;
    entryTimestamp!: string;
    food!: Food;
    // Add other properties as needed
}
