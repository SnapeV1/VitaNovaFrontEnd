import {Exercise} from "./Exercise";
import {UserModule} from "./user.module";

export class UserRating {
  id!: number; // Identifiant de la note (optionnel si vous utilisez la création côté serveur)
  rate!: number;
  exerciseId!: Exercise;
  iduser!: UserModule;// Note donnée par l'utilisateur
}
