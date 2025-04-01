import { ThisReceiver } from '@angular/compiler';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent  implements OnInit {
  messages: any[] = [];
  content: string = '';
  senderId!: string;
  receiverId!: string;
 
  connected = false;
  users: any[] = [];  // Tableau pour stocker les utilisateurs
  usersLastSeen: { [key: string]: string } = {}; // Un dictionnaire clé-valeur pour stocker la dernière connexion

  constructor(
    private chatService: ChatService,
    private userService: UserService ,
    private authService: AuthService ,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    // Récupérer les utilisateurs
    this.userService.getUsers().subscribe((users) => {
      this.users = users;  // Stocker la liste des utilisateurs dans le tableau users
      console.log('Liste des utilisateurs:', this.users); // Pour déboguer
    });
   this.getUserid();
  
  }

  send(): void {
    const message = {
      senderId: this.senderId,
      receiverId: this.receiverId,
      content: this.content
    };

    this.chatService.sendMessage(message);
    this.messages.push(message);
    
    this.content = '';
  }
 
  // Méthode pour sélectionner un utilisateur (et affecter son ID au receiverId)
  selectReceiver(userId: string) {
    this.receiverId = userId;  // Mettre à jour l'ID du destinataire
    console.log('ID du destinataire sélectionné:', this.receiverId);
    
    // Une fois le destinataire sélectionné, tu peux charger l'historique des messages
    this.loadMessageHistory();
  }

  // Méthode pour récupérer l'historique des messages
  loadMessageHistory() {
    if (this.senderId && this.receiverId) {
      this.chatService.getMessageHistory(this.senderId, this.receiverId).subscribe(
        (messages) => {
          this.messages = messages;
          console.log('Historique des messages:', this.messages);
        },
        (error) => {
          console.error('Erreur lors de la récupération de l\'historique des messages', error);
        }
      );
    }
  }

  getUserid(): void {
    this.userService.getUserData().subscribe(
      (userData) => {
        this.senderId = userData.userId;
        console.log('ID de l\'utilisateur connecté:', this.senderId);

        // 🔥 Connexion automatique au WebSocket
        this.chatService.connect(this.senderId);
        this.chatService.receiveMessages().subscribe(msg => {
          this.messages.push(msg);
        });
        this.connected = true;
    this.loadUsers();
      },
      (error) => {
        console.error('Erreur lors de la récupération du rôle utilisateur', error);
      }
    );
  }

  // loadUsers(): void {
  //   this.userService.getUsers().subscribe((users) => {
  //     // 🔥 Filtrer pour exclure l'utilisateur connecté
  //     this.users = users.filter(user => user.userId !== this.senderId);
  //     console.log('Liste des utilisateurs (sans l\'utilisateur connecté):', this.users);
  //   });
  // }
  loadUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users.filter(user => user.userId !== this.senderId);
    
      this.users.forEach(user => {
        this.authService.getLastSeen(user.userId).subscribe(
          (lastSeen) => {
            const lastSeenDate = new Date(lastSeen);
            this.usersLastSeen[user.userId] = lastSeenDate.toLocaleString();
            
            // Vérification si l'utilisateur est en ligne récemment (ex: 5 minutes)
            const now = new Date();
            const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
            user.isRecentlyOnline = lastSeenDate > fiveMinutesAgo;
  
            console.log(`${user.name} - Dernière connexion: ${this.usersLastSeen[user.userId]} - Récemment en ligne: ${user.isRecentlyOnline}`);
          },
          (error) => {
            console.error(`Erreur lors de la récupération de la dernière connexion de ${user.name}`, error);
            this.usersLastSeen[user.userId] = 'Inconnue';
            user.isRecentlyOnline = false;
          }
        );
      });
  
      console.log('Liste des utilisateurs avec dernière connexion:', this.usersLastSeen);
    });
  }
  
  
 
}
