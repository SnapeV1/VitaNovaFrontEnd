import { Component,OnDestroy,OnInit } from '@angular/core';
import { NotificationServiceService } from '../Service/notification-service.service';
import { Notification } from '../Models/Notification';
import { WebSocketNotifService } from '../web-socket-notif.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {AuthService} from "../Service/auth.service";
import {UserModule} from "../Models/user.module";





@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements  OnInit, OnDestroy  {
  notifications: string[] = [];
  gymNotification: string;
  showCard: boolean = false; 
  showNotif: boolean = false; 
  showEx: boolean = false; 
  showCh: boolean = false; 
  userId :UserModule


  subscription: Subscription;

  hydrationReminder: string;
  // Flag to control card visibility


  selectedCategories: { [key: string]: boolean } = {};
  private notificationsSubscription: Subscription;
  private gymNotificationSubscription: Subscription;
  exerciseNotification: string = '';
  exerciseSubscription: Subscription;
  weeklyNotification: string = '';
  weeklyNotificationSubscription: Subscription;


  constructor(
    private router: Router,
    private authService: AuthService,

    private notificationService: NotificationServiceService,
    private webSocketService: WebSocketNotifService
  ) {this.authService.getUserInfoFromToken().subscribe(userId => {
    this.userId = userId;
  }); }

  ngOnInit() {
    // Initialize WebSocket connection
    this.webSocketService.connect();


    this.weeklyNotificationSubscription = this.webSocketService.getWeeklyNotifications().subscribe(notification => {
      if (notification && notification.trim() !== '') {
        this.weeklyNotification = notification;
        this.showNotif = true; // Display card when weekly notification is received
      } else {
        this.showNotif = false; // Hide card if weekly notification is empty or falsy
      }
    });
  

    // Subscribe to WebSocket notifications
    this.notificationsSubscription = this.webSocketService.getNotifications().subscribe(
      (notificationContents) => {
        this.notifications = notificationContents;
      }
    );
    this.subscription = this.webSocketService.getHydrationReminders().subscribe(reminder => {
      if (reminder && reminder.trim() !== '') {
        this.hydrationReminder = reminder;
        this.showNotif = true; // Display card when hydration reminder is received
      } else {
        this.showNotif = false; // Hide card if hydration reminder is empty or falsy
      }
    });
    this.exerciseSubscription = this.webSocketService.getExerciseNotifications().subscribe(notification => {
      if (notification && notification.trim() !== '') {
        this.exerciseNotification = notification;
        this.showEx = true; // Display card when exercise notification is received
      } else {
        this.showEx = false; // Hide card if exercise notification is empty or falsy
      }
    });
    this.gymNotificationSubscription = this.webSocketService.getGymNotifications()
    .subscribe((gymNotification: string) => {
      if (gymNotification && gymNotification.trim() !== '') {
        this.gymNotification = gymNotification;
        this.showCard = true; // Display card when gym notification is received
      } else {
        this.showCard = false; // Hide card if gym notification is empty or falsy
      }
    });

  }
  closeCardd() {
    // Method to handle closing or hiding the card
    this.showNotif = false;
  }
  closeCard() {
    // Method to handle closing or hiding the card
    this.showCard = false;
  }
  closeEx() {
    // Method to handle closing or hiding the card
    this.showEx = false;
  }
  closeCh() {
    // Method to handle closing or hiding the card
    this.showCh = false;
  }

  ngOnDestroy() {
    // Unsubscribe from WebSocket notifications
    this.notificationsSubscription.unsubscribe();
    this.gymNotificationSubscription.unsubscribe();


    // Disconnect WebSocket
  }
 navigateToGyms() {
  this.router.navigate(['vitaNova/gym']);
}
navigateToHelthy() {
  this.router.navigate(['vitaNova/healthy']);
}
  subscribeToNotifications() {
    const idUser = 2; // Replace with actual user ID
    const categories = Object.keys(this.selectedCategories).filter(category => this.selectedCategories[category]);

    // Subscribe to selected categories
    this.notificationService.subscribeToCategories(idUser, categories).subscribe(
      (response) => {
        console.log('Subscription successful:', response);
        this.fetchNotifications(categories);


        // After subscribing, start listening for notifications
        this.webSocketService.subscribeToNotifications(idUser);
      },
      (error) => {
        console.error('Subscription failed:', error);
      }
    );
  }
  private fetchNotifications(categories: string[]) {

    const subscription = true; // Assuming subscription is always true for this case

    // Call backend service to fetch notifications based on criteria
    this.notificationService.getNotificationContentsByCriteria(this.userId.idUser, categories, subscription).subscribe(
      (notificationContents) => {
        console.log('Fetched notifications:', notificationContents);
        
    

        // Start listening for notifications via WebSocket
        this.webSocketService.subscribeToNotifications(this.userId.idUser);
       
      },
      (error) => {
        console.error('Failed to fetch notifications:', error);
      }
    );
  }

  unsubscribeFromNotifications() {
    const idUser = 2; // Replace with actual user ID

    // Unsubscribe from all categories
    this.notificationService.unsubscribeFromCategories(idUser).subscribe(
      (response) => {
        console.log('Unsubscription successful:', response);

        // Clear notifications
        this.notifications = [];
      },
      (error) => {
        console.error('Unsubscription failed:', error);
      }
    );
  }
  clearNotifications(notification: string) {
    const idUser = 2; // Replace with actual user ID
  
    // Unsubscribe from all categories
    this.notificationService.unsubscribeFromCategories(idUser).subscribe(
      (response) => {
        console.log('Unsubscription successful:', response);
  
        // Implement logic to remove the specific notification from the array
        const index = this.notifications.indexOf(notification);
        if (index !== -1) {
          this.notifications.splice(index, 1); // Remove the notification from the array
        }
      },
      (error) => {
        console.error('Unsubscription failed:', error);
  
        // If unsubscription fails, still remove the notification from the array
        const index = this.notifications.indexOf(notification);
        if (index !== -1) {
          this.notifications.splice(index, 1); // Remove the notification from the array
        }
      }
    );
  }

  getCategoryTags(notification: string): string[] {
    const categories: string[] = [];
    if (notification.includes('Period Tracking')) {
      categories.push('Period Tracking');
    }
    if (notification.includes('Exercises')) {
      categories.push('Exercises');
    }
    if (notification.includes('Food')) {
      categories.push('Food');
    }
    if (notification.includes('Community')) {
      categories.push('Community');
    }
    if (notification.includes('Shop')) {
      categories.push('Shop');
    }
    console.log('Detected categories:', categories); // Log detected categories
    return categories;
  }

  redirectNotification(category: string) {
    console.log('Redirecting to category:', category);

    // Navigate based on the extracted category
    switch (category) {
      case 'Period Tracking':
        this.router.navigate(['vitaNova/PeriodInformation']);
        break;
      case 'Exercises':
        this.router.navigate(['vitaNova/exerciseworkout']);
        break;
      case 'Food':
        this.router.navigate(['vitaNova/foodFront']);
        break;
      case 'Community':
        this.router.navigate(['vitaNova/community']);
        break;
      case 'Shop':
        this.router.navigate(['vitaNova/showProductUser']);
        break;
      default:
        break;
    }
  }
getCategoryFromNotification(notification: string): string {
  // Extract the first word of the notification content
  const words = notification.trim().split(' ');
  if (words.length > 0) {
    const firstWord = words[0].toLowerCase(); // Convert to lowercase for case-insensitive comparison

    // Determine category based on the first word
    if (firstWord === 'track') {
      return 'Period Tracking';
    } else if (firstWord === 'discover') {
      return 'Exercises';
    } else if (firstWord === 'explore') {
      return 'Food';
    } else if (firstWord === 'connect') {
      return 'Community';
    }
  }

  // Default category if no match is found
  return 'Shop';
}

}