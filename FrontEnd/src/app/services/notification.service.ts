import { Injectable } from '@angular/core';
import { Client, Stomp } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private stompClient: any;
  private notificationsSubject = new BehaviorSubject<string[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor() {}

  // Connect to WebSocket and subscribe to notifications
  connectToWebSocket() {
    const socket = new SockJS('http://localhost:8087/ws'); // Replace with your WebSocket URL
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, (frame: string) => {
      console.log('Connected: ' + frame);

      // Subscribe to the notifications topic
      this.stompClient.subscribe('/topic/notifications', (messageOutput: any) => {
        const message = JSON.parse(messageOutput.body);
        this.addNotification(message.message); // Add the received message to notifications
      });
    });
  }

  // Add a new notification to the list
  private addNotification(message: string) {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, message]);
  }

  // Disconnect WebSocket
  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
  }
}
