import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../ModelProduct/Product';
import { ProductService } from '../ServiceProduct/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../ServiceProduct/CarteService';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit  {

  productId!: number;
  product!: Product;

  constructor(private route: ActivatedRoute, public productService: ProductService ,private cartservice: CartService) { }

  ngOnInit(): void {
    const productIdParam = this.route.snapshot.paramMap.get('productId');
    if (productIdParam) {
      this.productId = +productIdParam;
      this.fetchProductDetails();
    } else {
      console.error('Product ID parameter is null.');
    }
  }

  fetchProductDetails(): void {
    this.productService.getProductById(this.productId).subscribe(
      (product: Product) => {
        this.product = product;
      },
      (error) => {
        console.error('Error fetching product details:', error);
        // Handle error, e.g., show an error message
      }
    );
  }
  private imageBaseUrl = 'http://192.168.174.134/uploads/';
      getImageUrl(imagePath: string): string {
        return this.imageBaseUrl + imagePath;
      }
}
