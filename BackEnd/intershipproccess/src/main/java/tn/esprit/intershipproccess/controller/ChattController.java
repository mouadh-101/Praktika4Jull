package tn.esprit.intershipproccess.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import tn.esprit.intershipproccess.entity.ChatMessage;
import tn.esprit.intershipproccess.entity.Message;
import tn.esprit.intershipproccess.entity.MessageChat;
import tn.esprit.intershipproccess.repository.MessageRepository;

import java.time.LocalDateTime;

@Controller
public class ChattController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private MessageRepository messageRepository;

    @MessageMapping("/chat")
    public void sendMessage(@Payload Message message) {
        System.out.println("📨 Reçu depuis frontend : " + message.getSenderId() + " -> " + message.getReceiverId());

        // 1. Sauvegarde du message en base
        message.setTimestamp(LocalDateTime.now()); // si tu as un champ date
        messageRepository.save(message);

        // 🧠 IMPORTANT : on envoie au bon topic dynamiquement
        messagingTemplate.convertAndSend(
                "/topic/messages/" + message.getReceiverId(),
                message
        );
    }
}
