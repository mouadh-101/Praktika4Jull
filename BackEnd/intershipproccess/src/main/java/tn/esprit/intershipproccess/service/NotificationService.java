package tn.esprit.intershipproccess.service;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {
      public void sendNotification(String userId, String message) {
            // Pour l'instant, on fait juste un log.
            // Cela pourrait être un e-mail ou une notification push dans une vraie application.
            System.out.println("Notification à l'utilisateur " + userId + ": " + message);
        }

}
