import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Notification } from './Models/Notification';
import { BehaviorSubject,Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WebSocketNotifService {

  private stompClient: Stomp.Client;
  private notificationsSubject = new BehaviorSubject<string[]>([]);
  private notificationGymSubject = new BehaviorSubject<string>('');
  private notificationHydraSubject = new BehaviorSubject<string>('');
  private notificationExerciseSubject = new BehaviorSubject<string>('');
  private weeklyNotificationSubject = new BehaviorSubject<string>('');





  constructor() {
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    const socket = new SockJS('http://localhost:8081/ws');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      console.log('WebSocket connected');
      this.subscribeToGymNotifications();
      this.subscribeToHydrationReminders(); 
      this.subscribeToExerciseNotifications(); 
      this.subscribeToWeeklyNotifications();
      // Subscribe to exercise notifications after connecting
      // Subscribe to notifications after connecting

      
    });
    
  }
  private subscribeToExerciseNotifications() {
    const topic = '/topic/exerciseNotification';
    this.stompClient.subscribe(topic, (message) => {
      const notification: string = message.body;
      this.notificationExerciseSubject.next(notification);
    });
  }
  public getExerciseNotifications(): BehaviorSubject<string> {
    return this.notificationExerciseSubject;
  }
  private subscribeToHydrationReminders() {
    const topic = '/topic/hydrationReminders';

    this.stompClient.subscribe(topic, (message) => {
      const notification: string = message.body;
      this.notificationHydraSubject.next(notification);
    });
  }
  public getWeeklyNotifications(): BehaviorSubject<string> {
    return this.weeklyNotificationSubject;
  }
  public getHydrationReminders(): BehaviorSubject<string> {
    return this.notificationHydraSubject;
  }
  private subscribeToWeeklyNotifications() {
    const topic = '/topic/weeklyNotification';
    this.stompClient.subscribe(topic, (message) => {
      const notification: string = message.body;
      this.weeklyNotificationSubject.next(notification);
    });}

  public subscribeToNotifications(idUser: number) {
    const topic = `/topic/notifications/${idUser}`;

    this.stompClient.subscribe(topic, (message) => {
      const notificationContents: string[] = JSON.parse(message.body);
      this.notificationsSubject.next(notificationContents);
    });

   
  }
  
  private subscribeToGymNotifications() {
    const topic = '/topic/notifications';

    this.stompClient.subscribe(topic, (message) => {
      const notification: string = message.body;
      this.notificationGymSubject.next(notification);
    });
  }
  public getGymNotifications(): BehaviorSubject<string> {
    return this.notificationGymSubject;
  }

  public getNotifications() {
    return this.notificationsSubject.asObservable();
  }

  public disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log('WebSocket disconnected');
      });
    }
  }
  public connect() {
    if (!this.stompClient || !this.stompClient.connected) {
      this.initializeWebSocket();
    }
  }
  
  
}