import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

import { Router } from '@angular/router';
import { ProductService } from '../ServiceProduct/product.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})

export class UpdateProductComponent implements OnInit {
  productData: any ={
    namePr: '',
    categoriePr: '',
    pricePr: null,
    quantityPr: null,
    descriptionPr: '',
    statusPr: '',
    picturePr: ''
  };
  productId: number | undefined;
  imageFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  @ViewChild('productForm')productForm!: NgForm;

  constructor(private productService: ProductService, private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.productId = +id;
        this.getProduct(this.productId);
      } else {
        console.error("L'identifiant du produit est indéfini.");
      }
    });
  }

  getProduct(id: number): void {
    this.productService.getProductById(id)
      .subscribe(
        (data: any) => {
          this.productData = data;
          // Vérifier si l'URL de l'image est disponible dans les données du produit
          if (this.productData && this.productData.picturePr) {
            // Si oui, l'attribuer à imagePreview
            this.imagePreview = this.productData.picturePr;
            // Afficher l'URL de l'image dans la console pour le débogage
            console.log("URL de l'image lue :", this.imagePreview);
          }
        },
        (error) => {
          console.error(error);
        }
      );
  }
  
  updateProduct(): void {
    if (!this.productData) {
      console.error('Le produit est null.');
      return;
    }
  
    const formData = new FormData();
  
    // Ajouter les champs modifiés au FormData
    if (this.productData.namePr) {
      formData.append('namePr', this.productData.namePr);
    }
    if (this.productData.categoriePr) {
      formData.append('categoriePr', this.productData.categoriePr);
    }
    if (this.productData.pricePr) {
      formData.append('pricePr', this.productData.pricePr.toString());
    }
    if (this.productData.quantityPr) {
      formData.append('quantityPr', this.productData.quantityPr.toString());
    }
    if (this.productData.descriptionPr) {
      formData.append('descriptionPr', this.productData.descriptionPr);
    }
    if (this.productData.statusPr) {
      formData.append('statusPr', this.productData.statusPr);
    }
  
    // Supprimer l'image existante si une nouvelle image est sélectionnée
    if (this.imageFile) {
      formData.append('image', this.imageFile, this.imageFile.name);
    } else if (this.productData.picturePr) {
      // Ne pas ajouter d'image si aucune nouvelle image n'est sélectionnée
      // Supprimer l'image existante
      formData.append('removeImage', 'true');
    }
  
    // Assurez-vous que l'identifiant du produit est défini avant de le passer
    if (this.productId !== undefined) {
      this.productService.updateProduct(formData, this.productId).subscribe(
        (response) => {
          console.log('Produit mis à jour avec succès :', response);
          // Rediriger vers l'interface showProduct après la mise à jour du produit
          this.router.navigate(['/admin/showProduct']);
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du produit :', error);
        }
      );
    } else {
      console.error("L'identifiant du produit est indéfini.");
    }
  }
  
  

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file: File = event.target.files[0];

      // Lecture du contenu de l'image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result; // L'image est maintenant disponible sous forme d'URL base64
      };
      reader.readAsDataURL(file);

      // Mise à jour de l'image sélectionnée
      this.imageFile = file;
    }
  }
}
