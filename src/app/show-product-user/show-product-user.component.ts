

import { Component, HostListener } from '@angular/core';
import { Product } from 'src/app/ModelProduct/Product';
import { ProductService } from '../ServiceProduct/product.service';
import { AuthService } from '../Service/auth.service';
import { LikeProductService } from '../ServiceProduct/LikeProductService ';
import { Router } from '@angular/router';
import { CartService } from '../ServiceProduct/CarteService';
import { MatDialog } from '@angular/material/dialog';
import { SideBarBackComponent } from '../back-office/side-bar-back/side-bar-back.component';
import { Commandeline } from '../ModelProduct/Commandeline';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UserModule } from '../Models/user.module';




@Component({
  selector: 'app-show-product-user',
  templateUrl: './show-product-user.component.html',
  styleUrls: ['./show-product-user.component.css']
})
export class ShowProductUserComponent {

  listeProduits: Product[] = [];
  searchTerm: string = '';
  isCardExpanded: boolean = false; // Variable pour suivre l'état d'agrandissement de la carte
  selectedProduct: Product | null = null;
  idUser: number ; 
  commandelines: Commandeline[] = [];
  nombreLikes: number = 0;
  showDetails: boolean = false;
  numberOfCommandelines: number = 0;
  cartId: number = 3;
  showSidebar: boolean = false;
  qrCodeUrl!: string;
  productId !: number ;
user:UserModule ;
  constructor(private productService: ProductService , private authService: AuthService ,private router: Router, private cartService: CartService ,private dialog: MatDialog ) { 
 
  }

  
  ngOnInit(): void {

    this.getUserInfoFromToken();
  }
  








  getUserInfoFromToken(): void {
    this.authService.getUserInfoFromToken().subscribe(
      (response: UserModule) => {
      this.user = response;
      this.idUser=this.user.idUser;
      this.showProducts();
      this.listenForLikeUpdates();
      this.fetchNumberOfCommandelines();
      this.fetchCommandelinesInCart();
      console.log('id user : ' , this.idUser);

    }
    );

      }








  showProducts(): void {
// Appel du service pour récupérer la liste des produits
this.productService.showProducts()
.subscribe( //écouter les résultats d'une opération asynchrone, comme une requête HTTP vers un serveur. 
  // Succès : les produits ont été récupérés avec succès 
  (products: any[]) => {
    // Filtrer les produits pour exclure ceux qui sont archivés
    this.listeProduits = products
      .filter(product => product.archivePr === false)
      // Mapper les propriétés des produits pour les adapter au format attendu dans le composant / permet de manipuler facilement les données 
      .map(product => ({
        idPr: product.idPr, 
        namePr: product.namePr,
        pricePr: product.pricePr,
        categoriePr: product.categoriePr,
        // Récupérer l'URL de l'image à partir du service ProductService
        picturePr: this.productService.getImageUrl(product.picturePr),
        descriptionPr: product.descriptionPr,
        statusPr: product.statusPr,
        archivePr: false,
        quantityPr: product.quantityPr,
        likeCount: product.likeCount ,
        qrCodeUrl: product.qrCodeUrl
      }));
            
          console.log('Données récupérées du service:', this.listeProduits);
        },
        (error) => {
          console.error('Erreur lors de la récupération des produits :', error);
        }
      );
  }
  addLikeToProduct(productId: number): void {
    this.productService.addLike(this.idUser, productId).subscribe(
      (response: any) => {
        const product = this.listeProduits.find(prod => prod.idPr === productId);
        if (product) {
          product.likeCount+= 1;
        }
      },
      error => {
        console.error('Erreur lors de l\'ajout du like :', error);
        // Handle error here
      }
    );
  }




  listenForLikeUpdates(): void {
    const eventSource = new EventSource('/likes');

    eventSource.onmessage = (event) => {
      this.nombreLikes = parseInt(event.data);
    };

    eventSource.onerror = (error) => {
      console.error('Erreur SSE : ', error);
    };
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
              likeCount: product.likeCount || 0,
              qrCodeUrl: product.qrCodeUrl
            }));
          console.log('Résultats de la recherche :', this.listeProduits);
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
  private imageBaseUrl = 'http://192.168.174.134/uploads/';
  getImageUrl(imagePath: string): string {
    return this.imageBaseUrl + imagePath;
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  addProductToCart(productId: number): void {
    // Check if the elderlyId is defined
    if (this.idUser !== undefined) {
      // Call the addProductToOrder method from the productService
      this.productService.addProductToCart(productId, this.idUser).subscribe(
        () => {
          console.log('Product added to order successfully');
        },
        (error) => {
          console.error('Error adding product to order: ', error);
        }
      );
    } else {
      console.error('Elderly ID is undefined');
    }
  }

  
  
  fetchCommandelinesInCart(): void {
    this.cartService.getAllCommandelinesInCart(this.idUser).subscribe(
      commandelines => {
        this.commandelines = commandelines;
      },
      error => {
        console.error('Error fetching command lines:', error);
        // Handle error, e.g., show an error message
      }
    );
  }
  
  fetchNumberOfCommandelines(): void {
    this.cartService.getNumberOfCommandelinesInCart(this.idUser).subscribe(
      count => {
        console.log("number " + count)
        this.numberOfCommandelines = count;
      },
      error => {
        console.error('Error fetching number of command lines:', error);
        // Handle error, e.g., show an error message
      }
    );
  }
  
  openCartDialog() {
    const dialogRef = this.dialog.open(SidebarComponent, {
      width: '600px', // Set the width as needed
      data: this.cartService ? this.cartService.getCartItems() : [] // Pass cart items from service (if used)
    });
  }

  openSideBar(){
this.showSidebar=!this.showSidebar;
console.log(this.commandelines);

    
  }
  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }
  
  deleteProduct(productId: string) {
    // Implement the logic to delete the product from the shopping cart
    console.log('Deleting product with ID:', productId);
    // Example logic: Find the product index and remove it from the commandelines array
    const index = this.commandelines.findIndex(commandeline => commandeline.product.idPr.toString() === productId);
    if (index !== -1) {
      this.commandelines.splice(index, 1);
    }
  }
  
  loadProducts(): void {
    this.productService.showProducts().subscribe(
      products => {
        this.listeProduits = products;
  
        // Generate QR code for each product
        this.listeProduits.forEach(product => {
          this.generateQRCode(product.idPr);
        });
      },
      error => {
        console.error('Error loading products:', error);
      }
    );
  }


  generateQRCode(productId: number): void {
    this.productService.generateQRCode(productId).subscribe(
      (qrCodeUrl: string) => {
        // Assign QR code URL to the corresponding product
        const productIndex = this.listeProduits.findIndex(product => product.idPr === productId);
        if (productIndex !== -1) {
          this.listeProduits[productIndex].qrCodeUrl = qrCodeUrl;
        }
      },
      error => {
        console.error('Error fetching QR code URL for product ID:', productId, error);
      }
    );
  }
  
    private imageBaseUrl2 = 'http://localhost:80/aziz/';
    getImageUrl2(imagePath: string): string {
      return this.imageBaseUrl2 + imagePath;
    }
  
  getTotalPrice(): number {
    let totalPrice = 0;
    for (const commandeline of this.commandelines) {
      totalPrice += commandeline.product.pricePr * commandeline.quantity;
    }
    return totalPrice;
  }
}
  /*
  expandCard(product: Product): void {
    this.selectedProduct = product;
    this.isCardExpanded = false;
  }

  closeExpandedCard(): void {
  this.selectedProduct = null;
      this.isCardExpanded = true;
    
  }


  onDocumentClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    const isExpandedCard = clickedElement.closest('.expanded-card');
    if (!isExpandedCard && this.isCardExpanded) {
      // Si l'élément cliqué n'est pas à l'intérieur de la carte agrandie et que la carte est agrandie
      // alors réduire la carte agrandie
      this.closeExpandedCard();
    }*/
  
  
  


/*
expandCard(product: Product): void {
  this.selectedProduct = product;
  this.isCardExpanded = false;
}

closeExpandedCard(): void {
this.selectedProduct = null;
    this.isCardExpanded = true;
  
}


onDocumentClick(event: MouseEvent): void {
  const clickedElement = event.target as HTMLElement;
  const isExpandedCard = clickedElement.closest('.expanded-card');
  if (!isExpandedCard && this.isCardExpanded) {
    // Si l'élément cliqué n'est pas à l'intérieur de la carte agrandie et que la carte est agrandie
    // alors réduire la carte agrandie
    this.closeExpandedCard();
  }*/