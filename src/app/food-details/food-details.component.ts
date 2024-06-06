import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Food } from '../Models/Foods';
import { FoodService } from "../Service/food.service";

@Component({
    selector: 'app-food-details',
    templateUrl: './food-details.component.html',
    styleUrls: ['./food-details.component.css']
})
export class FoodDetailsComponent implements OnInit {
    food: Food = {} as Food;
    baseUrl: string = 'http://localhost:80/uploads/';

    constructor(private route: ActivatedRoute, private foodService: FoodService) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            const foodId = params['id'];
            this.loadFoodDetails(foodId);
        });
    }

    loadFoodDetails(foodId: number): void {
        this.foodService.getFoodById(foodId).subscribe(food => {
            this.food = food;
            this.food.foodPic = this.baseUrl + this.food.foodPic;
        });
    }
}
