// period-insights.component.ts

import { Component, OnInit,ViewChild,ElementRef  } from '@angular/core';
import { PeriodTracker } from '../Models/PeriodTracker';
import { PeriodTrackerServiceService } from '../Service/period-tracker-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Exercise } from '../Models/Exercise';
import { Food } from '../Models/Foods';
import { Color } from '@swimlane/ngx-charts';
import { JournalEntry } from '../Models/JournalEntry';
import axios from 'axios'; // Import axios
import { HttpClient, HttpHeaders } from '@angular/common/http';



export interface SpotifyResults {
  tracks: {
    album: {
      images: { url: string }[];
    };
    name: string;
    artists: { name: string }[];
  }[];
}


@Component({
  selector: 'app-period-insights',
  templateUrl: './period-insights.component.html',
  styleUrls: ['./period-insights.component.css'],
})
export class PeriodInsightsComponent implements OnInit {
  periodTrackers: PeriodTracker[] = [];
  cyclePhase: string = 'Unknown'; // Default value or placeholder
  idPeriod!: number;
  nextOvulationDate?: string;
  nextPeriodDate?: string;
  userQuestion: string = ''; // Track user input
  chatHistory: string[] = [];
  exercises: Exercise[] = [];
  foods: Food[] = []; // Define an array to store fetched foods
  isChatOpen: boolean = false;
  fertileWindow: string[] = [];
  journalEntryText: string = '';
  emotionResult: string = '';  // To store the emotion analysis result
  predictionResult: any;
  spotifyResults: SpotifyResults = {
    tracks: [],
  };




  single: any[] = [];
  view: [number, number] = [350, 400];

  // Chart options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Cycle Phase';
  showYAxisLabel = true;
  yAxisLabel = 'Duration';
  colorScheme = {
  domain: ['#5AA454', '#C7B42C', '#AAAAAA'],
  xAxis: '#ffffff', // white color for X axis label
  yAxis: '#ffffff' // white color for Y axis label
};


  constructor(
    private route: ActivatedRoute,
    private periodTrackerService: PeriodTrackerServiceService,
    private router: Router,
    private http: HttpClient,


  ) { 
  
}
onSelect(event: any) {
  console.log(event);
}


  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.idPeriod = +params['id']; // Convert to number
      if (this.idPeriod) {
        // Fetch cycle phase when component initializes
        this.fetchCyclePhase(this.idPeriod);
        this.fetchNextOvulationDate(this.idPeriod);
        // Fetch next period date
        this.fetchNextPeriodDate(this.idPeriod);
        this.fetchFertileWindow(this.idPeriod); // Call the method here
        this.addChatbotClickListener();
        this.fetchChartData(this.idPeriod); // Fetch chart data


      }
    });


  }

  fetchCyclePhase(idPeriod: number) {
    console.log('Fetching cycle phase for idPeriod:', idPeriod);

    this.periodTrackerService.getPeriodTrackerById(idPeriod).subscribe(
      (data: any) => {
        console.log('Data received from backend:', data);

        // Access cyclePhase instead of cycle_phase
        const cyclePhase = data ? data.cyclePhase : 'Unknown';
        console.log('Cycle phase:', cyclePhase);

        this.cyclePhase = cyclePhase;
      },
      (error) => {
        console.error('Error fetching cycle phase:', error);
      }
    );
  }

  fetchNextOvulationDate(idPeriod: number) {
    this.periodTrackerService.getPeriodTrackerById(idPeriod).subscribe(
      (periodTracker: PeriodTracker) => {
        this.periodTrackerService
          .calculateOvulationDate(periodTracker, idPeriod)
          .subscribe(
            (ovulationDate: any) => {
              this.nextOvulationDate = ovulationDate;
            },
            (error) => {
              console.error('Error fetching next ovulation date:', error);
            }
          );
      },
      (error) => {
        console.error('Error fetching period tracker:', error);
      }
    );
  }

  fetchNextPeriodDate(idPeriod: number) {
    this.periodTrackerService.getPeriodTrackerById(idPeriod).subscribe(
      (periodTracker: PeriodTracker) => {
        this.periodTrackerService
          .calculateNextPeriodDate(periodTracker, idPeriod)
          .subscribe(
            (periodDate: any) => {
              this.nextPeriodDate = periodDate;
            },
            (error) => {
              console.error('Error fetching next period date:', error);
            }
          );
      },
      (error) => {
        console.error('Error fetching period tracker:', error);
      }
    );
  }

  addChatbotClickListener(): void {
    // Add an event listener to the chatbot image
    const chatbotImg = document.querySelector('img[alt="Chatbot"]');
    if (chatbotImg) {
      chatbotImg.addEventListener('click', function () {
        // Toggle the display of the chat window
        const chatWindow = document.getElementById('chatWindowContainer');
        if (chatWindow) {
          chatWindow.style.display =
            chatWindow.style.display === 'none' ? 'block' : 'none';
        }
      });
    }
  }

  sendMessage(): void {
    if (this.userQuestion.trim() === '') return;

    // Add user question to chat history
    this.chatHistory.push(`You: ${this.userQuestion}`);

    // Send user question to the chatbot API
    this.periodTrackerService.askQuestionToChatbot(this.userQuestion).subscribe(
      (response) => {
        // Extract the response text from the API response object
        const responseData = response ? response.response : 'No response from chatbot';

        // Add chatbot response to chat history
        this.chatHistory.push(`Chatbot: ${responseData}`);

        // Clear user input
        this.userQuestion = '';
      },
      (error) => {
        console.error('Error asking question to chatbot:', error);
      }
    );
  }

  fetchFertileWindow(idPeriod: number): void {
    this.periodTrackerService.getFertileWindow(idPeriod).subscribe(
      (fertileWindow: Date[]) => {
        // Convert Date array to string array
        this.fertileWindow = fertileWindow.map(date => this.formatDate(date));
        console.log('Fertile Window:', this.fertileWindow); // Log fetched fertileWindow
      },
      (error) => {
        console.error('Error fetching fertile window:', error);
      }
    );}
    formatDate(date: Date): string {
      return new Date(date).toLocaleDateString('en-CA');
    }


    fetchChartData(idPeriod: number): void {
      this.periodTrackerService.getPeriodTrackerById(idPeriod).subscribe(
        (periodTracker: PeriodTracker) => {
          const cycleLength = periodTracker.cycleLength;
          const periodLength = periodTracker.periodLength;
  
          // Calculate phase durations
          const ovulationPhase = Math.round(cycleLength * 0.15); // 15% of cycle length
          const menstrualPhase = periodLength;
          const follicularPhase = Math.round(cycleLength * 0.35); // 35% of cycle length
          const lutealPhase = cycleLength - ovulationPhase - follicularPhase;
  
          this.single = [
            {
              name: 'Ovulation Phase',
              value: ovulationPhase
            },
            {
              name: 'Menstrual Phase',
              value: menstrualPhase
            },
            {
              name: 'Follicular Phase',
              value: follicularPhase
            },
            {
              name: 'Luteal Phase',
              value: lutealPhase
            }
          ];
        },
        (error) => {
          console.error('Error fetching chart data:', error);
        }
      );
    }
    saveJournal(): void {
  if (this.journalEntryText.trim() === '') return;

  const options = {
    method: 'POST',
    url: 'https://ekman-emotion-analysis.p.rapidapi.com/ekman-emotion',
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json',
      'X-RapidAPI-Key': '020a985271msh63da4e188052ac8p1761aajsn6b9e047c9fb3',
      'X-RapidAPI-Host': 'ekman-emotion-analysis.p.rapidapi.com'
    },
    data: [
      {
        id: '1',
        language: 'en',
        text: this.journalEntryText // Use the journal text here
      }
    ]
  };

  axios.request(options)
    .then((response) => {
      console.log(response.data);
        this.predictionResult = response.data[0];
        this.fetchSpotifySuggestions();
        // Assigning predictionResult here
      
    })
    .catch((error) => {
      console.error('Error analyzing emotion:', error);
    });
}

async fetchSpotifySuggestions(): Promise<void> {
  let emotion = 'unknown';
  if (this.predictionResult && this.predictionResult.label) {
    emotion = this.predictionResult.label.toLowerCase();
  }

  let seedGenres = '';

  switch (emotion) {
    case 'joy':
      seedGenres = 'indie rock';
      break;
    case 'sadness':
      seedGenres = 'sad piano';
      break;
    case 'fear':
      seedGenres = 'relaxing ';
      break;
    case 'anger':
      seedGenres = 'hard rock ';
      break;
    default:
      seedGenres = 'pop';
  }

  const options = {
    method: 'GET',
    url: 'https://spotify23.p.rapidapi.com/recommendations/',
    params: {
      limit: '3',
      seed_tracks: '0c6xIDDpzE81m2q797ordA',
      seed_genres: seedGenres,
    },
    headers: {
      'X-RapidAPI-Key': '020a985271msh63da4e188052ac8p1761aajsn6b9e047c9fb3',
      'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    this.spotifyResults = response.data;
  } catch (error) {
    console.error(error);
  }
}























getRecommendations(): void {
  // Navigate to PeriodInsightsComponent with the period ID as a query parameter
  this.router.navigate(['vitaNova/PeriodRecommendations']);
}


}


