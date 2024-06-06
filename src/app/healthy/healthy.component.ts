import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-healthy',
  templateUrl: './healthy.component.html',
  styleUrls: ['./healthy.component.css']
})
export class HealthyComponent implements OnInit {
  nearbyRestaurants: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Call the function to fetch nearby restaurants when the component initializes
    this.fetchNearbyRestaurants();
  }

  fetchNearbyRestaurants() {
    const options = {
      params: new HttpParams()
        .set('query', ' good restaurants')
        .set('lat', '36.899742')
        .set('lng', '10.185640')
        .set('zoom', '13')
        .set('limit', '20')
        .set('language', 'en')
        .set('region', 'ariana'),
      headers: {
        'X-RapidAPI-Key': '020a985271msh63da4e188052ac8p1761aajsn6b9e047c9fb3', // Replace with your RapidAPI key
        'X-RapidAPI-Host': 'local-business-data.p.rapidapi.com'
      }
    };

    this.http.get<any>('https://local-business-data.p.rapidapi.com/search-in-area', options)
      .subscribe(response => {
        this.nearbyRestaurants = response.data;
        console.log('Nearby Restaurants:', this.nearbyRestaurants);
      }, error => {
        console.error('Error fetching nearby restaurants:', error);
      });
  }}