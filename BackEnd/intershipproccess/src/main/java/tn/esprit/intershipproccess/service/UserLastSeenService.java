package tn.esprit.intershipproccess.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.intershipproccess.entity.UserLastSeen;
import tn.esprit.intershipproccess.repository.UserLastSeenRepository;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserLastSeenService {

    @Autowired
    private UserLastSeenRepository userLastSeenRepository;

    // Mettre à jour la dernière connexion d'un utilisateur
    public void updateLastSeen(String userId) {
        UserLastSeen lastSeen = userLastSeenRepository.findByUserId(userId);

        if (lastSeen == null) {
            lastSeen = new UserLastSeen(userId, LocalDateTime.now());
        } else {
            lastSeen.setLastSeen(LocalDateTime.now());
        }

        userLastSeenRepository.save(lastSeen);
    }

    // Récupérer la dernière connexion d'un utilisateur
    public LocalDateTime getLastSeen(String userId) {
        Optional<UserLastSeen> lastSeen = Optional.ofNullable(userLastSeenRepository.findByUserId(userId));
        return lastSeen.map(UserLastSeen::getLastSeen).orElse(null);
    }
}
