import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService, ChatMessage } from 'src/app/services/chat.service'; // Assuming ChatMessage interface/type
import { UserService, User } from 'src/app/services/user.service'; // Assuming User interface/type
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesArea') private messagesArea!: ElementRef;

  messages: ChatMessage[] = [];
  content: string = '';
  senderId!: string; // Logged-in user's ID
  receiverId!: string; // Selected user to chat with
  receiverName!: string; // Name of the selected user
  selectedReceiver: User | null = null; // Full object of selected user

  users: User[] = [];
  usersLastSeen: { [key: string]: string } = {};

  isTyping: boolean = false;
  typingUser: string = '';
  
  isLoadingUsers: boolean = true;
  isLoadingMessages: boolean = false; // For message history loading

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef // To manually trigger change detection if needed
  ) {}

  ngOnInit(): void {
    this.getUseridAndConnect(); // Fetch current user's ID and connect to WebSocket
    this.loadUsers(); // Load all users for the contact list

    this.chatService.receiveTyping().subscribe(({ senderId, isTyping }) => {
      if (senderId !== this.senderId && senderId === this.receiverId) { // Only show if it's the current chat partner
        this.isTyping = isTyping;
        if (isTyping) {
          this.typingUser = this.users.find(u => u.userId === senderId)?.name || 'Someone';
          this.cdr.detectChanges(); // Manually trigger change detection for typing indicator
          // Optional: auto-clear typing indicator if no new typing event for a few seconds
        } else {
          this.typingUser = ''; // Clear when stop typing event is received
        }
      }
    });
    
    // Subscribe to online users list from chat service
    this.chatService.getOnlineUsers().subscribe(onlineUserIds => {
      this.users.forEach(user => {
        user.isOnline = onlineUserIds.includes(user.userId);
      });
      this.loadLastSeenInfo(); // Refresh last seen info based on online status
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom(); // Scroll to bottom whenever view updates (new message, etc.)
  }

  getUseridAndConnect(): void {
    this.userService.getUserData().subscribe({
      next: (userData) => {
        if (userData && userData.userId) {
          this.senderId = userData.userId;
          console.log('Logged-in User ID (Sender ID):', this.senderId);
          this.chatService.connect(this.senderId);
          this.subscribeToMessages(); // Subscribe to incoming messages after connection
        } else {
          console.error('User ID not found in user data.');
          // Handle error: show message to user, redirect to login, etc.
        }
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
  }
  
  subscribeToMessages(): void {
    this.chatService.receiveMessages().subscribe(msg => {
      // Only add message if it's part of the current conversation
      if ((msg.senderId === this.senderId && msg.receiverId === this.receiverId) || 
          (msg.senderId === this.receiverId && msg.receiverId === this.senderId)) {
        this.messages.push(msg);
        this.isTyping = false; // If current user sent a message, or receiver sent one, they are not typing
      }
      // If message is for another chat, handle notifications or unread counts (future enhancement)
      console.log("Received message, current messages: ", this.messages);
      this.cdr.detectChanges(); // Ensure view updates
    });
  }


  loadUsers(): void {
    this.isLoadingUsers = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        // Exclude the current logged-in user from the contact list
        this.users = users.filter(user => user.userId !== this.senderId);
        console.log('Contact list users:', this.users);
        this.loadLastSeenInfo();
        this.isLoadingUsers = false;
      },
      error: (err) => {
        console.error("Error loading users:", err);
        this.isLoadingUsers = false;
      }
    });
  }

  loadLastSeenInfo(): void {
    const userIdsToQuery = this.users.filter(user => !user.isOnline).map(user => user.userId);
    if (userIdsToQuery.length === 0) {
        this.users.forEach(user => { if(user.isOnline) this.usersLastSeen[user.userId!] = "Online"; });
        this.cdr.detectChanges();
        return;
    }

    const lastSeenRequests = userIdsToQuery.map(userId =>
      this.authService.getLastSeen(userId!) // Assuming userId is not null
    );
    
    forkJoin(lastSeenRequests).subscribe({
        next: lastSeenDataArray => {
            userIdsToQuery.forEach((userId, index) => {
                this.usersLastSeen[userId!] = this.formatLastSeen(lastSeenDataArray[index]);
            });
            this.users.forEach(user => { if(user.isOnline) this.usersLastSeen[user.userId!] = "Online"; });
            this.cdr.detectChanges(); // Trigger change detection
        },
        error: err => console.error("Error fetching last seen batch:", err)
    });
  }
  
  formatLastSeen(lastSeenTimestamp: string | null): string {
    if (!lastSeenTimestamp || lastSeenTimestamp === "Online") return "Online";
    return moment(lastSeenTimestamp).fromNow();
  }


  selectReceiver(user: User): void {
    if (this.selectedReceiver?.userId === user.userId) return; // Already selected

    this.selectedReceiver = user;
    this.receiverId = user.userId!; // Assuming userId is always present
    this.receiverName = user.name!; // Assuming name is always present
    console.log('Selected receiver:', this.receiverName, 'ID:', this.receiverId);
    this.loadMessageHistory();
    this.isTyping = false; // Reset typing indicator when switching chats
  }

  loadMessageHistory(): void {
    if (this.senderId && this.receiverId) {
      this.isLoadingMessages = true;
      this.chatService.getMessageHistory(this.senderId, this.receiverId).subscribe({
        next: (messages) => {
          this.messages = messages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date() // Ensure timestamp is Date object
          }));
          console.log('Message history loaded:', this.messages);
          this.isLoadingMessages = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching message history:', error);
          this.isLoadingMessages = false;
        }
      });
    }
  }
  
  send(): void {
    if (!this.content?.trim() || !this.senderId || !this.receiverId) return;

    const message: ChatMessage = {
      // id: '', // Usually generated by backend
      senderId: this.senderId,
      receiverId: this.receiverId,
      content: this.content.trim(),
      timestamp: new Date() // Client-side timestamp, backend should use its own
    };

    this.chatService.sendMessage(message);
    // Optimistically add to messages array. Consider waiting for ack or handling differently.
    this.messages.push(message); 
    this.content = '';
    this.chatService.sendStopTyping({ senderId: this.senderId, receiverId: this.receiverId }); // Stop typing after send
    this.isTyping = false; // Ensure local typing indicator is also off
    this.scrollToBottom();
  }

  onTyping(): void {
    if (this.receiverId && this.content?.trim()) { // Send typing only if there's content
      this.chatService.sendTyping({ senderId: this.senderId, receiverId: this.receiverId });
    } else if (this.receiverId && !this.content?.trim()) { // Send stop typing if content is cleared
      this.chatService.sendStopTyping({ senderId: this.senderId, receiverId: this.receiverId });
    }
  }
  
  sanitizeContent(content: string): SafeHtml {
    // Basic sanitization, enhance as needed. For text-only, this might not be necessary.
    // If allowing some HTML (e.g., links), use DomSanitizer carefully.
    return this.sanitizer.bypassSecurityTrustHtml(content); // Be cautious with this if content is user-generated HTML
  }

  getSenderName(senderId: string): string {
    if (senderId === this.senderId) return 'You';
    const user = this.users.find(u => u.userId === senderId);
    return user?.name || 'Unknown';
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesArea?.nativeElement) {
        this.messagesArea.nativeElement.scrollTop = this.messagesArea.nativeElement.scrollHeight;
      }
    } catch(err) { console.error("Error scrolling to bottom:", err); }
  }
}
