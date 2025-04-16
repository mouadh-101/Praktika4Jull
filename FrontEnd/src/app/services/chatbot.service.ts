import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:8086/api/chatbot/ask'; 

  constructor(private http: HttpClient) {}

  askChatbot(message: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}?message=${encodeURIComponent(message)}`);
  }
}
