package tn.esprit.intershipproccess.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import tn.esprit.intershipproccess.dto.NotificationMessage;

@Controller
public class NotificationController {
    @MessageMapping("/sendNotification")
    @SendTo("/topic/notifications")
    public NotificationMessage sendNotification(NotificationMessage message) {
        return message;
    }
}
