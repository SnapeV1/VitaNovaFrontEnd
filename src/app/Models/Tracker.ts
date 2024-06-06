import { Hydration } from '../Models/Hydration'; // Assurez-vous d'importer correctement les autres modèles nécessaires
import { PersonalGoalsModule } from '../Models/personal-goals.module';
import { FoodCard } from '../Models/FoodCard';



export class Tracker {
  id!: number;
  hydration!: Hydration;
  consumedCalories!: number;
  archive!: boolean;
  notification!: string;
  date!: Date;
  personalGoals!: PersonalGoalsModule;
  foodCards!: FoodCard[];
  breakfast!: FoodCard[];
  lunch!: FoodCard[];
  dinner!: FoodCard[];
  snacks!: FoodCard[];
}
