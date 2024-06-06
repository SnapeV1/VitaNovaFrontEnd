import { Component ,OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gym',
  templateUrl: './gym.component.html',
  styleUrls: ['./gym.component.css']
})
export class GymComponent implements OnInit {
  nearbyGyms: any[] = [];

  constructor(private http: HttpClient,private router: Router) { }

  ngOnInit() {
    this.fetchNearbyGyms();
  }

  fetchNearbyGyms() {
    const options = {
      params: {
        query: 'gym centers,  ariana ',
        limit: '20',
        lat: '36.899742',
        lng: '10.185640',
        zoom: '13',
        language: 'en',
        region: 'us'
      },
      headers: {
        'X-RapidAPI-Key': '020a985271msh63da4e188052ac8p1761aajsn6b9e047c9fb3',
        'X-RapidAPI-Host': 'local-business-data.p.rapidapi.com'
      }
    };

    this.http.get<any>('https://local-business-data.p.rapidapi.com/search', options)
      .subscribe(response => {
        this.nearbyGyms = response.data;
        console.log('Nearby Gyms:', this.nearbyGyms);
      }, error => {
        console.error('Error fetching nearby gyms:', error);
      });
  }

  getBack(): void {
    // Navigate to PeriodInsightsComponent with the period ID as a query parameter
    this.router.navigate(['vitaNova/home']);
  }

}

