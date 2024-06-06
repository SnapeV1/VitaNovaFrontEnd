import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/ModelProduct/Product';
import { ProductService } from '../ServiceProduct/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  product: Product = new Product();
  selectedFile: File | null = null;
  imageUrl: string | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  @ViewChild('productForm') productForm!: NgForm;

  constructor(private productService: ProductService, private router: Router) {}

  addProduct(): void {
    if (this.productForm.valid) {
      const formData = new FormData();
      formData.append('namePr', this.product.namePr);
      formData.append('categoriePr', this.product.categoriePr);
      formData.append('pricePr', this.product.pricePr.toString());

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      // Append optional fields if they exist
      if (this.product.descriptionPr) {
        formData.append('descriptionPr', this.product.descriptionPr);
      }
      formData.append('quantityPr', this.product.quantityPr.toString());

      if (this.product.statusPr) {
        formData.append('statusPr', this.product.statusPr);
      }

      this.productService.addProduct(formData)
        .subscribe(
          response => {
            console.log(response);
            this.router.navigate(['/admin/showProduct']);
          },
          error => {
            console.error(error);
          }
        );
    } else {
      console.error('The form is not valid.');
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Reading the content of the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result; // The image is now available as a base64 URL
      };
      reader.readAsDataURL(file);
    }
  }
}
