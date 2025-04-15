package tn.esprit.intershipproccess.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.intershipproccess.service.UserLastSeenService;

import java.time.LocalDateTime;
@RestController
@RequestMapping("/api/internships/user-last-seen")
public class UserLastSeenController {
    @Autowired
    private UserLastSeenService userLastSeenService;

    // Mettre à jour la dernière connexion d'un utilisateur
    @PutMapping("/{userId}")
    public void updateLastSeen(@PathVariable String userId) {
        userLastSeenService.updateLastSeen(userId);
    }

    // Récupérer la dernière connexion d'un utilisateur
    @GetMapping("/{userId}")
    public LocalDateTime getLastSeen(@PathVariable String userId) {
        return userLastSeenService.getLastSeen(userId);
    }


}
