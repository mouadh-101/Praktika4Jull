package esprit.microservice1.repositories;

import esprit.microservice1.entities.Like;
import esprit.microservice1.entities.Post;
import esprit.microservice1.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Integer> {
    Optional<Like> findByUserAndPost(User user, Post post);
    long countByPost(Post post);
}
