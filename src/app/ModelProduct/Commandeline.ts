import { Product } from "./Product";

export interface Commandeline {
    idOrder: number;
    productName: string;
    dateOrder: string; // Assuming dateOrder is a string in ISO 8601 format
    prixOrder: number;
    totalOrder: number;
    quantity: number;
    archiveOrder: boolean;
    cart: any; // Depending on your backend response, you might need to define a Cart model as well
    product: Product; // Depending on your backend response, you might need to define a Product model as well
  }
  