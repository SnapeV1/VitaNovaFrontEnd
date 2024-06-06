import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './front-office/navbar/navbar.component';
import { FooterComponent } from './front-office/footer/footer.component';
import { AllTemplateFrontComponent } from './front-office/all-template-front/all-template-front.component';
import { UserComponent } from './front-office/user/user.component';
import { RegisterComponent } from './front-office/user/register/register.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './front-office/user/login/login.component';
import { NavBarBackComponent } from './back-office/nav-bar-back/nav-bar-back.component';
import { AllTemplateBackComponent } from './back-office/all-template-back/all-template-back.component';
import { FooterBackComponent } from './back-office/footer-back/footer-back.component';
import { SideBarBackComponent } from './back-office/side-bar-back/side-bar-back.component';
import { CommunicationComponent } from './communication/communication.component';
import { CommunityComponent } from './community/community.component';
import { ChallengeComponent } from './challenge/challenge.component';
import { AddexerciseComponent } from './addExercise/addexercise.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ExerciseListComponent } from './exercise-list/exercise-list.component';
import {RouterModule} from "@angular/router";
import { AddPlanComponent } from './add-plan/add-plan.component';



//yoser+Ons
import { FoodCardComponent } from './food-card/food-card.component';
import { FoodDetailsComponent } from './food-details/food-details.component';
import { FoodDetailsDialogComponent } from './food-details-dialog/food-details-dialog.component';
import {MatIconModule} from "@angular/material/icon";
import {CommonModule} from "@angular/common";
import { ExerciseListFrontComponent } from './exercise-list-front/exercise-list-front.component';
import { ExerciseModalComponent } from './exercise-modal/exercise-modal.component';
import { ExerciseLinkModelComponent } from './exercise-link-model/exercise-link-model.component';
import { ExerciseDetailsComponent } from './exercise-details/exercise-details.component';
import { GetPlanUserComponent } from './get-plan-user/get-plan-user.component';
import {MatCardModule} from "@angular/material/card";
import { TimerPageComponent } from './timer-page/timer-page.component';
import { FoodComponent } from './food/food.component';
import { FoodListComponent } from './food-list/food-list.component';
//firas
import { HomeComponent } from './home/home.component';
import { AddChallengeComponent } from './add-challenge/add-challenge.component';
import { AddCommunityComponent } from './add-community/add-community.component';
import { AllCommunitiesBackComponent } from './all-communities-back/all-communities-back.component';
import { AllChallengesBackComponent } from './all-challenges-back/all-challenges-back.component';
import { FindCommunityComponent } from './find-community/find-community.component';
import { UpdateCommunityComponent } from './update-community/update-community.component';
//Amine
import { UsersBackComponent } from './back-office/users-back/users-back.component';
import { UserProfileComponent } from './front-office/user/profile/user-profile/user-profile.component';
import { NgxWebstorageModule } from 'ngx-webstorage';

//Aziz
import { UpdateProductComponent } from './update-product/update-product.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ShowProductComponent } from './show-product/show-product.component';
import { ShowProductUserComponent } from './show-product-user/show-product-user.component';
import { CartComponent } from './cart/cart.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SidebarComponent } from './sidebar/sidebar.component';
import { StripeComponent } from './stripe/stripe.component'; // Import MatDialogModule
import { MatSliderModule } from '@angular/material/slider';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Ng5SliderModule } from 'ng5-slider';
import { ProductDetailsComponent } from './product-details/product-details.component';







//sheima
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PeriodTrackerComponent } from './period-tracker/period-tracker.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ShowPeriodComponent } from './show-period/show-period.component';
import { CalendarComponent } from './calendar/calendar.component';
import { PeriodInsightsComponent } from './period-insights/period-insights.component';
import { OneToOneComComponent } from './one-to-one-com/one-to-one-com.component';
import { PeriodRecipesComponent } from './period-recipes/period-recipes.component';
import { DialogVerificationComponent } from './front-office/user/dialog-verification/dialog-verification.component';
import { DialogSuccessComponent } from './front-office/user/dialog-success/dialog-success.component';
import { DialogPersonalGoalsComponent } from './front-office/user/dialog-personal-goals/dialog-personal-goals.component';
import { DialogPlanComponent } from './front-office/user/dialog-plan/dialog-plan.component';
import { NgxStripeModule } from 'ngx-stripe';
import { CheckoutComponent } from './front-office/user/checkout/checkout.component';
import { CheckoutDoneComponent } from './front-office/user/checkout-done/checkout-done.component';

import { ProductDetailsDialogComponent } from './product-details-dialog/product-details-dialog.component';
import { FoodlistaddedComponent } from './foodlistadded/foodlistadded.component';
import { PeriodRecommendationsComponent } from './period-recommendations/period-recommendations.component';
import { DeleteAccountComponent } from './front-office/delete-account/delete-account.component';
import { VideoChatComponent } from './video-chat/video-chat.component';
import { TimerApiComponent } from './timer-api/timer-api.component';
import { PgoalsBackComponent } from './back-office/pgoals-back/pgoals-back.component';
//import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PaymentsuccesComponent } from './paymentsucces/paymentsucces.component';
import { FactureComponent } from './facture/facture.component';
import { NotificationComponent } from './notification/notification.component';
import { GymComponent } from './gym/gym.component';
import { HealthyComponent } from './healthy/healthy.component';



import {Chart} from "chart.js";
import{GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule} from "angularx-social-login";
import { MatSelectModule } from '@angular/material/select';
import {MealCardsComponent} from "./meal-cards/meal-cards.component";
import { RecipiesLowCarbComponent } from './recipies-low-carb/recipies-low-carb.component';
import { HydrationComponent } from './hydration/hydration.component';

@NgModule({
  declarations: [
    AppComponent,
     CommunicationComponent,
    CommunityComponent,
    ChallengeComponent,
    NavbarComponent,
    FooterComponent,
    AllTemplateFrontComponent,
    UserComponent,
    RegisterComponent,
    LoginComponent,
    NavBarBackComponent,
    AllTemplateBackComponent,
    FooterBackComponent,
    SideBarBackComponent,
    AddexerciseComponent,
    ExerciseListComponent,
    AddPlanComponent,
//yoser
    ExerciseListFrontComponent,
    ExerciseModalComponent,
    ExerciseLinkModelComponent,
    ExerciseDetailsComponent,

    MealCardsComponent,
//ons
    FooterComponent,
    FoodComponent,
    FoodListComponent,
    FoodCardComponent,
    FoodDetailsComponent,
    FoodDetailsDialogComponent,
    GetPlanUserComponent,
    TimerPageComponent,
//firas
    HomeComponent,
    AddChallengeComponent,
    AddCommunityComponent,
    AllCommunitiesBackComponent,
    AllChallengesBackComponent,
    FindCommunityComponent,
    UpdateCommunityComponent,
    VideoChatComponent,
    
//Amine
   UsersBackComponent,
    UserProfileComponent,

    UpdateProductComponent,
    AddProductComponent,
    ShowProductComponent,
    CartComponent,
    //sheima
    NavBarBackComponent,
    AllTemplateBackComponent,
    FooterBackComponent,
    PeriodTrackerComponent,
    ShowPeriodComponent,
    CalendarComponent,
    PeriodInsightsComponent,
    OneToOneComComponent,
    PeriodRecipesComponent,
    SidebarComponent,
    StripeComponent,




    ProductDetailsComponent,
    
    
    
  
    DialogVerificationComponent,
    DialogSuccessComponent,
    DialogPersonalGoalsComponent,
    DialogPlanComponent,
    CheckoutComponent,
    CheckoutDoneComponent,
    ShowProductUserComponent,
    TimerApiComponent,
    RecipiesLowCarbComponent,


    ProductDetailsDialogComponent,
      FoodlistaddedComponent,
      PeriodRecommendationsComponent,
      NotificationComponent,
      GymComponent,
      HealthyComponent,
      DeleteAccountComponent,
      PgoalsBackComponent,
      RecipiesLowCarbComponent,
      PaymentsuccesComponent,
      FactureComponent,
      HydrationComponent,


    ],
    entryComponents:[AddChallengeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    SocialLoginModule,
    NgxWebstorageModule.forRoot(), // Import and configure SessionStorageModule

//yoser
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatIconModule,
//firas
    //sheima
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
   // NgxChartsModule,
    //AmineV2
    NgxStripeModule.forRoot('pk_test_51OGMOXL0ywzjvxffqUYYflCe9Q5EkentWEbdikQOwmBa7pyku3CYF6rt2OKYoJpxq9Y5BkFAIJf9AR04xWPEy3l400swqfsj2O'),
    ReactiveFormsModule, // Add this line
    MatDialogModule,
    MatSliderModule,
    Ng5SliderModule,
    MatSelectModule,


  ],
  exports:[MatDialogModule,],
  providers: [
    
  ],  schemas:[CUSTOM_ELEMENTS_SCHEMA],




  bootstrap: [AppComponent]
})
export class AppModule { }
