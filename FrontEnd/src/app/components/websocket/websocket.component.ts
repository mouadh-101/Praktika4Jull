import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-websocket',
  templateUrl: './websocket.component.html',
  styleUrls: ['./websocket.component.css']
})
export class WebsocketComponent implements OnInit {
  username!: string;
  message = '';
  messages: any[] = [];

  constructor(private websocketService: WebsocketService) {}

  ngOnInit() {
    this.username = sessionStorage.getItem('username') || 'Guest';
    this.websocketService.connect(this.username);
    this.websocketService.messages$.subscribe((msgs) => {
      this.messages = msgs;
    });
  }

  sendMessage() {
    if (this.message.trim()) {
      this.websocketService.sendMessage({
        sender: this.username,
        content: this.message,
        type: 'CHAT'
      });
      this.message = '';
    }
  }
}
