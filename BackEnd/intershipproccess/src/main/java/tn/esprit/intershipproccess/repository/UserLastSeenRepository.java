package tn.esprit.intershipproccess.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.intershipproccess.entity.UserLastSeen;

public interface UserLastSeenRepository extends JpaRepository<UserLastSeen, String> {
    // Trouver la dernière connexion d'un utilisateur par son ID
    UserLastSeen findByUserId(String userId);
}
