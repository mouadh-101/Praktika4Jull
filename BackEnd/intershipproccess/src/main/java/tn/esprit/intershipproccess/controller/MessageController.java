package tn.esprit.intershipproccess.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.intershipproccess.entity.Message;
import tn.esprit.intershipproccess.repository.MessageRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/internships/messages")
public class MessageController {
    @Autowired
    private MessageRepository messageRepository;

    // POST: Envoyer un message
    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        message.setTimestamp(LocalDateTime.now());
        Message savedMessage = messageRepository.save(message);
        return ResponseEntity.ok(savedMessage);
    }

    // GET: Récupérer l'historique entre deux utilisateurs
    @GetMapping
    public ResponseEntity<List<Message>> getMessages(
            @RequestParam String senderId,
            @RequestParam String receiverId) {
        List<Message> messages = messageRepository
                .findBySenderIdAndReceiverIdOrderByTimestamp(senderId, receiverId);

        // Ajouter les messages dans l'autre sens pour historique complet (facultatif)
        messages.addAll(messageRepository
                .findBySenderIdAndReceiverIdOrderByTimestamp(receiverId, senderId));

        // Optionnel : trier par date
        messages.sort(Comparator.comparing(Message::getTimestamp));

        return ResponseEntity.ok(messages);
    }
    @GetMapping("/{senderId}/{receiverId}")
    public List<Message> getMessageHistory(@RequestParam String senderId, @RequestParam String receiverId) {
        List<Message> messages1 = messageRepository.findBySenderIdAndReceiverIdOrderByTimestamp(senderId, receiverId);
        List<Message> messages2 = messageRepository.findBySenderIdAndReceiverIdOrderByTimestamp(receiverId, senderId);

        List<Message> allMessages = new ArrayList<>();
        allMessages.addAll(messages1);
        allMessages.addAll(messages2);

        // Tri par date (croissant)
        allMessages.sort(Comparator.comparing(Message::getTimestamp));
        return allMessages;
    }
}
