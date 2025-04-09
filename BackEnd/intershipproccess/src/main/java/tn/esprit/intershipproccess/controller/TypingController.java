package tn.esprit.intershipproccess.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import tn.esprit.intershipproccess.entity.TypingEvent;

@Controller
public class TypingController {
    // 📩 Quand un utilisateur tape, envoyer l'événement aux abonnés
    @MessageMapping("/typing")
    @SendTo("/topic/typing")
    public TypingEvent handleTypingEvent(TypingEvent typingEvent) {
        return typingEvent;
    }
}
