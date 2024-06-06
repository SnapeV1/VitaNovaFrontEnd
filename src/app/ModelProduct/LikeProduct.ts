
import { UserModule } from "../model/user/user.module";
import { Product } from "./Product";

export class LikeProduct {
    likePr: number;
    product: Product;
    user: UserModule;
  
    constructor(likePr: number, product: Product, user: UserModule) {
      this.likePr = likePr;
      this.product = product;
      this.user = user;
    }
}