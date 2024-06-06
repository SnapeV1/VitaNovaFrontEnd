import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Product } from 'src/app/ModelProduct/Product';
import { ProductService } from '../ServiceProduct/product.service';
import axios from 'axios';
import { Options } from 'ng5-slider';






@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.component.html',
  styleUrls: ['./show-product.component.css']
})
export class ShowProductComponent implements OnInit {
  minValue: number = 0;
  maxValue: number = 200;
  sliderOptions: Options = {
    floor: 0,
    ceil: 100
    // Other options as needed
  };

  
  listeProduits: Product[] = [];
  searchTerm: string = ''; // Attribut pour stocker le terme de recherche
  searchResults: Product[] = [];
  filteredProducts: Product[] = [];
  categoryFilter: string = '';
  priceFilter: number | null = null;
  statusFilter: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalItems: number = 0;
  totalPages: number[] = [];
 

  constructor(public productService: ProductService) { }

  ngOnInit(): void {
    this.categoryFilter = 'ALL'; // Initialiser la catégorie par défaut à "ALL"
    this.filterProducts();
  }

  showProducts(): void {
    this.productService.showProducts().subscribe(
      (products: any[]) => {
        const filteredProducts = products.filter(product => !product.archivePr && product.quantityPr > 0);
  
        // Mettre à jour la liste listeProduits avec les produits à afficher
        this.listeProduits = filteredProducts.map(product => ({
          idPr: product.idPr,
          namePr: product.namePr,
          pricePr: product.pricePr,
          categoriePr: product.categoriePr,
          picturePr: this.productService.getImageUrl(product.picturePr),
          descriptionPr: product.descriptionPr,
          quantityPr: product.quantityPr,
          statusPr: product.statusPr,
          archivePr: false,
          likeCount: product.likeCount,
          qrCodeUrl: product.qrCodeUrl
          
        }));
  
        console.log('Données récupérées depuis le service:', this.listeProduits);
      },
      (error) => {
        console.error('Erreur lors de la récupération des produits :', error);
      }
    );
  }

 


  
  searchProducts(): void {
    if (this.searchTerm.trim() !== '') {
      this.productService.searchProductsByName(this.searchTerm).subscribe(
        (products: any[]) => {
          this.listeProduits = products
            .filter(product => product.archivePr === false)
            .map(product => ({
              idPr: product.idPr, 
              namePr: product.namePr,
              pricePr: product.pricePr,
              categoriePr: product.categoriePr,
              picturePr: this.productService.getImageUrl(product.picturePr),
              descriptionPr: product.descriptionPr,
              statusPr: product.statusPr,
              archivePr: false,
              quantityPr: product.quantityPr,
              likeCount: product.likeCount,
              qrCodeUrl: product.qrCodeUrl
            }));
          console.log('Résultats de la recherche :', this.listeProduits);
          this.showProducts();
        },
        (error) => {
          console.error('Erreur lors de la recherche de produits :', error);
        }
      );
    } else {
      // Si le terme de recherche est vide, afficher tous les produits
      this.showProducts();
    }
  }
  
  
  archiverProduct(productId: number): void {
    axios.put(`http://localhost:8081/Product/${productId}`)
      .then(response => {
        console.log('Produit archivé avec succès :', response.data);
         this.filterProducts(); 
      })
      .catch(error => {
        console.error('Erreur lors de l\'archivage du produit :', error);
      });
  }

  filterProducts(): void {
    // Récupérer tous les produits depuis le service
    this.productService.showProducts().subscribe(
      (produits: Product[]) => {
        // Filtrer les produits pour ne garder que ceux qui ne sont pas archivés
        let filteredProducts = produits.filter(product => product.archivePr === false);
        
        // Filtrer ensuite selon le prix et la catégorie si les filtres sont définis
        if (this.categoryFilter === 'ALL') {
          // Afficher tous les produits sans filtre de catégorie
          if (this.minValue !== null && this.maxValue !== null) {
            // Si un filtre de prix est défini, appliquer le filtre
            filteredProducts = filteredProducts.filter(product => {
              // Vérifier que product.pricePr est compris entre minValue et maxValue
              return product.pricePr !== null && product.pricePr >= this.minValue && product.pricePr <= this.maxValue;
            });
          }
        } else {
          // Filtrer par catégorie spécifiée
          if (this.minValue !== null && this.maxValue !== null || this.categoryFilter !== '') {
            // Appliquer les filtres de prix et de catégorie
            filteredProducts = filteredProducts.filter(product => {
              // Vérifier si le produit passe le filtre de prix
              let passPriceFilter = (this.minValue === null || this.maxValue === null) || (product.pricePr !== null && product.pricePr >= this.minValue && product.pricePr <= this.maxValue);
              // Vérifier si le produit passe le filtre de catégorie
              let passCategoryFilter = this.categoryFilter === '' || product.categoriePr === this.categoryFilter;
              // Retourner vrai si le produit passe les deux filtres, faux sinon
              return passPriceFilter && passCategoryFilter;
            });
          }
        }
        
        // Mettre à jour la liste des produits filtrés
        this.filteredProducts = filteredProducts;
      },
      (error) => {
        console.error('Erreur lors de la récupération des produits :', error);
      }
    );
  }
  
  



// Méthode appelée lorsqu'une catégorie est sélectionnée
onCategoryChange(event: any): void {
  // Mettre à jour la valeur du filtre de catégorie
  this.categoryFilter = event.target.value;
  // Appeler la méthode de filtrage pour mettre à jour la liste des produits filtrés
  this.filterProducts();
}

// Méthode appelée lorsqu'un prix est sélectionné
onPriceChange(event: number): void {
  // Update the price filter value
  this.priceFilter = event;
  // Call the filtering method to update the list of filtered products
  this.filterProducts();
}

// Méthode pour paginer les produits filtrés
paginateProducts(): void {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalItems);
  this.listeProduits = this.filteredProducts.slice(startIndex, endIndex);
}

 
}