import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllTemplateFrontComponent } from './front-office/all-template-front/all-template-front.component';
import { RegisterComponent } from './front-office/user/register/register.component';
import { LoginComponent } from './front-office/user/login/login.component';
import { AllTemplateBackComponent } from './back-office/all-template-back/all-template-back.component';
import {FoodComponent} from "./food/food.component";
import {FoodListComponent} from "./food-list/food-list.component";

import {AddexerciseComponent} from "./addExercise/addexercise.component";
import {ExerciseListComponent} from "./exercise-list/exercise-list.component";
//yoser
import {TimerApiComponent} from "./timer-api/timer-api.component";
import {FoodCardComponent} from "./food-card/food-card.component";
import {FoodDetailsComponent} from "./food-details/food-details.component";
import {ExerciseListFrontComponent} from "./exercise-list-front/exercise-list-front.component";
import {ExerciseModalComponent} from "./exercise-modal/exercise-modal.component";
import {ExerciseDetailsComponent} from "./exercise-details/exercise-details.component";
import {GetPlanUserComponent} from "./get-plan-user/get-plan-user.component";
import {TimerPageComponent} from "./timer-page/timer-page.component";
//ons
import {FoodlistaddedComponent} from "./foodlistadded/foodlistadded.component";



//firas
import { CommunityComponent } from './community/community.component';
import { HomeComponent } from './home/home.component';
import { AddCommunityComponent } from './add-community/add-community.component';
import { AllCommunitiesBackComponent } from './all-communities-back/all-communities-back.component';
import { AddChallengeComponent } from './add-challenge/add-challenge.component';
import { AllChallengesBackComponent } from './all-challenges-back/all-challenges-back.component';
import { FindCommunityComponent } from './find-community/find-community.component';
import { UpdateCommunityComponent } from './update-community/update-community.component';
import { VideoChatComponent } from './video-chat/video-chat.component';

//Amine
import { UsersBackComponent } from './back-office/users-back/users-back.component';
import { UserProfileComponent } from './front-office/user/profile/user-profile/user-profile.component';

import { AddProductComponent } from './add-product/add-product.component';
import { ShowProductComponent } from './show-product/show-product.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { ShowProductUserComponent } from './show-product-user/show-product-user.component';

import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
//sheima
import { PeriodTrackerComponent } from './period-tracker/period-tracker.component';
import {ShowPeriodComponent}from './show-period/show-period.component'
import { PeriodInsightsComponent } from './period-insights/period-insights.component';
import { PeriodRecipesComponent } from './period-recipes/period-recipes.component';
import { CartComponent } from './cart/cart.component';
import { PeriodRecommendationsComponent } from './period-recommendations/period-recommendations.component';
import { NotificationComponent } from './notification/notification.component';
import { GymComponent } from './gym/gym.component';
import { HealthyComponent } from './healthy/healthy.component';

import {RecipiesLowCarbComponent} from "./recipies-low-carb/recipies-low-carb.component";
import { PgoalsBackComponent } from './back-office/pgoals-back/pgoals-back.component';
import {MealCardsComponent} from "./meal-cards/meal-cards.component";
import { ProductDetailsComponent } from './product-details/product-details.component';
import { PaymentsuccesComponent } from './paymentsucces/paymentsucces.component';
import {HydrationComponent} from "./hydration/hydration.component";
const routes: Routes = [

  {path:"",redirectTo:"/vitaNova/home",pathMatch:'full'},
  {path:"vitaNova",redirectTo:"/vitaNova/home",pathMatch:'full'},

  {path:"videoChat?roomID=**",component:VideoChatComponent},
  { path:"vitaNova",
    component:AllTemplateFrontComponent,children:[
      {path:"home",component:HomeComponent},
      {path: "profile", component: UserProfileComponent},
      //ons
      {path:"foodFront",component:FoodCardComponent},
      {
        path:"list-of-foods",
        component:FoodlistaddedComponent,
      },

      { path: 'foodDetails/:id', component: FoodDetailsComponent },
      //firas

      {path:"community", component:CommunityComponent,children:[
          {path:"addChallenge/:id", component:AddChallengeComponent},
        ]},
        {path:"vitaNova/community/videoChat?roomID=**",component:VideoChatComponent},
      {path:"addCommunity",component:AddCommunityComponent},
      {path:"findCommunity",component:FindCommunityComponent},
      {path:"updateCommunity/:id",component:UpdateCommunityComponent},
      //yoser
      {path: "exerciseworkout",component:ExerciseListFrontComponent},
      {path:"exercises/:exerciseId",component:ExerciseDetailsComponent},
      {path:"workoutplan",component:GetPlanUserComponent},
      {path:"foodFront",component:FoodCardComponent},
      { path: 'foodDetails/:id', component: FoodDetailsComponent },
      { path: 'Timer/:id', component: TimerPageComponent },
      { path: 'timer-api', component: TimerApiComponent },
      {path: 'mealCard',component: MealCardsComponent},
      {path:'lowCarb',component: RecipiesLowCarbComponent},
      {path: 'hydration',component: HydrationComponent},
{path:"showProductUser",
component: ShowProductUserComponent},   

    {path:"Cart",component: CartComponent},
    {path:"PayementSuccess",component:PaymentsuccesComponent},
 
    {path:"ProductDetails/:productId",
  component: ProductDetailsComponent},
      //sheima
      {path:"PeriodInformation",
        component:PeriodTrackerComponent},
      {path:"ShowPeriodInformation",
        component:ShowPeriodComponent},
      { path: 'PeriodInformation/:idPeriod', component: PeriodTrackerComponent },
      {path:'PeriodInsights',component:PeriodInsightsComponent},
      {path:'PeriodRecipes', component:PeriodRecipesComponent},
      {path:'PeriodRecommendations', component:PeriodRecommendationsComponent},
      {path:'Notifications',component:NotificationComponent},
      {path:'gym',component:GymComponent},
      {path:'healthy',component:HealthyComponent},

      {path: 'lowcarb',component: RecipiesLowCarbComponent},
    ]},
//amine

  { path: 'signup', component: RegisterComponent } ,
  { path: 'login', component: LoginComponent } ,
  {path: "profile", component: UserProfileComponent},


//Admin
  { path:'admin',component:AllTemplateBackComponent, children: [
      //ons
      {
        path:"addFood",
        component:FoodComponent,
      },
      {
        path: 'addFood/:id',
        component: FoodComponent // or whichever component you want to navigate to
      },

      {
        path:"getFoods",
        component:FoodListComponent,
      },
      {
        path: "listex",
        component: ExerciseListComponent,

      },
      {
        path: "exercise",
        component: AddexerciseComponent,
      },
      {path: "exerciseworkout",component:ExerciseListFrontComponent},
      {path:"exercises/:exerciseId",component:ExerciseDetailsComponent},

      //yoser
      {
        path:"addFood",
        component:FoodComponent,
      },
      {
        path: 'addFood/:id',
        component: FoodComponent // or whichever component you want to navigate to
      },

      {
        path:"getFoods",
        component:FoodListComponent,
      },
      {
        path: "listex",
        component: ExerciseListComponent,

      },
      {
        path: "exercise",
        component: AddexerciseComponent,
      },

      //firas
      {path:"communities",component:AllCommunitiesBackComponent},
      {path:"chalenges", component:AllChallengesBackComponent},
      //amine


      //aziz
      {path:"addProduct",
        component: AddProductComponent},
      {path:"showProduct",
        component: ShowProductComponent},
      { path: 'updateProduct/:id',
        component: UpdateProductComponent },

      
        {path:"users",
        component: UsersBackComponent},
        {path:"goals",
        component: PgoalsBackComponent},
      ]},
];



@NgModule({
  imports: [RouterModule.forRoot(routes),BrowserModule, FormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }