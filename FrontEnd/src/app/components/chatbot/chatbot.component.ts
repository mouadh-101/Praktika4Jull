import { Component } from '@angular/core';
import { ChatbotService } from 'src/app/services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  showChatbot = false;
  userMessage = '';
  conversation: { user?: string; bot?: string }[] = [];

  constructor(private chatbotService: ChatbotService) {}

  toggleChatbot() {
    this.showChatbot = !this.showChatbot;
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;

    const userMsg = this.userMessage;
    this.conversation.push({ user: userMsg, bot: '...' });

    this.chatbotService.askChatbot(userMsg).subscribe((response:any) => {
      if (response && response.choices && response.choices.length > 0) {
        this.conversation[this.conversation.length - 1].bot = response.choices[0].message.content;
      } else {
        this.conversation[this.conversation.length - 1].bot = "Erreur : Réponse inattendue.";
      }
    });

    this.userMessage = '';
  }
}