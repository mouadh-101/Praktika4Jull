import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client, Stomp } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8087/api/internships/messages';
  private stompClient!: Client;
  private messageSubject: Subject<any> = new Subject();
  constructor(private http: HttpClient) {
    
  }
  
   getMessageHistory(senderId: string, receiverId: string): Observable<any[]> {
    const url = `${this.apiUrl}?senderId=${senderId}&receiverId=${receiverId}`;
    console.log('Requête pour l\'historique des messages:', url); // Pour déboguer
    return this.http.get<any[]>(url);
  }
  
  
  
  connect(userId: string) {
    const socket = new SockJS('http://localhost:8087/ws');

    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000
    });

    this.stompClient.onConnect = () => {
      console.log('🟢 Connecté au WebSocket');

      this.stompClient.subscribe(
        '/topic/messages/' + userId,
        (message: any) => {
          console.log('📩 Reçu via WebSocket :', message);
          this.messageSubject.next(JSON.parse(message.body));
        }
      );
    };

    this.stompClient.onStompError = (frame) => {
      console.error('❌ Erreur STOMP :', frame);
    };

    // 🚀 ACTIVER LA CONNEXION !!
    this.stompClient.activate();
  }

  sendMessage(message: any): void {
    console.log('✉️ Envoi du message :', message);
    this.stompClient.publish({
      destination: '/app/chat',
      body: JSON.stringify(message)
    });
  }

  receiveMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  updateLastSeen(userId: string) {
    return this.http.post(`http://localhost:8087/api/internships/user-last-seen/${userId}`, {});  
  }
  
}
