import { Component, OnInit } from '@angular/core';
import { ProductService } from '../ServiceProduct/product.service';
import { CartService } from '../ServiceProduct/CarteService';
import { Commandeline } from '../ModelProduct/Commandeline';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { StripeComponent } from '../stripe/stripe.component';
import { StripeService } from '../ServiceProduct/StripeService';
import { AuthService } from '../Service/auth.service';
import { UserModule } from '../Models/user.module';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  commandelines: Commandeline[] = [];
  errorMessages: string[] = [];
totalPrice!: number ;
user: UserModule;
currencyC : string ;
userName: string;
userId:number ;
  constructor(public cartService: CartService,private dialog: MatDialog ,private stripeService: StripeService ,private productService: ProductService ,private authService: AuthService, 
    private http: HttpClient
  ) {

   }

   ngOnInit(): void {
    this.getUserInfoFromToken();
  }

  getUserInfoFromToken(): void {
    this.authService.getUserInfoFromToken().subscribe(
      (response: UserModule) => {
      this.user = response;
      this.userId=this.user.idUser;
      this.fetchCommandelinesInCart();

      console.log('id user : ' , this.user.idUser);

    }
    );

      }
  fetchCommandelinesInCart(): void {

    // Replace with the actual cart ID
    this.cartService.getAllCommandelinesInCart(this.userId).subscribe(
      commandelines => {
        this.commandelines = commandelines;
      },
      error => {
        console.error('Error fetching command lines:', error);
        // Handle error, e.g., show an error message
      }
    );
  }

  getTotalPrice(): number {
    let totalPrice = 0;
    for (const commandeline of this.commandelines) {
      totalPrice += commandeline.product.pricePr * commandeline.quantity;
    }
    return totalPrice;
  }

  onProductDeleted(productId: number) {
    const index = this.commandelines.findIndex(commandeline => commandeline.product.idPr === productId); // Find the index of the product in the commandelines array
    if (index !== -1) {
      this.commandelines.splice(index, 1); // Remove the product from the commandelines array
    }
  }
  
  updateQuantity(commandelineId: number, newQuantity: number) {
    // Récupérer la commande à partir de l'ID de la commande
    const commandeline = this.commandelines.find(cmd => cmd.idOrder === commandelineId);
    
    if (commandeline) {
      // Mettre à jour la quantité de la commande
      commandeline.quantity = newQuantity;
      
      // Appeler le service pour mettre à jour la quantité dans la base de données
      this.cartService.updateCommandelineQuantity(commandelineId, newQuantity).subscribe(
        () => {
          console.log('Quantité de la commande mise à jour avec succès !');
          // Mettre à jour le total ou effectuer d'autres actions si nécessaire
        },
        error => {
          console.error('Erreur lors de la mise à jour de la quantité de la commande :', error);
          // Gérer l'erreur, afficher un message à l'utilisateur, etc.
        }
      );
    }
  }
  
  onDeleteCommandeline(productId: number): void {
    this.cartService.deleteCommandelineFromCart(this.userId, productId)
      .subscribe(
        () => {
          console.log('Commandeline deleted successfully');
          // Remove the deleted commandeline from the array
          const index = this.commandelines.findIndex(cmd => cmd.product.idPr === productId);
          if (index !== -1) {
            this.commandelines.splice(index, 1);
          }
        },
        error => {
          console.error('Error deleting commandeline:', error);
          // Handle error, display error message, etc.
        }
      );
  }
  
 
// Définition de la fonction onCheckoutClicked
onCheckoutClicked(): void {
  // Création de l'objet data contenant les informations nécessaires pour l'initialisation du paiement
  let data: any = {
    "receiverWalletId": "663020aad65ce91d9ecb9ed9", // Identifiant du portefeuille du destinataire
    "token": "TND", // Token utilisé pour le paiement (par exemple : devise)
    "amount": this.getTotalPrice() * 1000, // Montant total du paiement (multiplication par 1000 pour convertir en millimes)
    "type": "immediate", // Type de paiement (dans ce cas, immédiat)
    "description": "payment description", // Description du paiement
    "acceptedPaymentMethods": [ // Méthodes de paiement acceptées
      "wallet",
      "bank_card",
      "e-DINAR"
    ],
    "lifespan": 10, // Durée de validité du paiement (en minutes)
    "checkoutForm": true, // Utilisation d'un formulaire de paiement
    "addPaymentFeesToAmount": true, // Ajout des frais de paiement au montant
    "firstName": "aziz", // Prénom du payeur
    "lastName": "benslimene", // Nom de famille du payeur
    "phoneNumber": "20616308", // Numéro de téléphone du payeur
    "email": "john.doe@gmail.com", // Adresse e-mail du payeur
    "orderId": "1234657", // Identifiant de la commande
    "webhook": "https://merchant.tech/api/notification_payment", // URL de webhook pour les notifications de paiement
    "silentWebhook": true, // Utilisation d'un webhook silencieux
    "successUrl": "http://localhost:4200/vitaNova/PayementSuccess", // URL de redirection en cas de succès du paiement
    "failUrl": "https://dev.konnect.network/gateway/payment-failure", // URL de redirection en cas d'échec du paiement
    "theme": "light" // Thème visuel pour la page de paiement
  };

  // Envoi d'une requête HTTP POST pour initialiser le paiement
  this.http.post('https://api.preprod.konnect.network/api/v2/payments/init-payment', data, {
    headers: {
      'x-api-key': '663020aad65ce91d9ecb9ed5:S8rsq1bwkKSL9lpLpCb2zV9O' // Clé d'API pour l'authentification
    }
  }).subscribe((response) => { // Abonnement à l'observable pour traiter la réponse
    console.log(response); // Affichage de la réponse dans la console
    // Redirection vers la page de paiement externe en extrayant l'URL de paiement de la réponse
    window.location.href = response['payUrl'];
  });
}

}

