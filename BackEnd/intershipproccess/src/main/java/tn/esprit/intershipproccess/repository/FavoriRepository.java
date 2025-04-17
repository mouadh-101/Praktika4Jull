package tn.esprit.intershipproccess.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.intershipproccess.entity.Favoris;

import java.util.List;
import java.util.Optional;

public interface FavoriRepository extends JpaRepository<Favoris, Integer> {
    Optional<Favoris> findByUserIdAndInternshipId(String userId, Integer internshipId);
    List<Favoris> findAllByUserId(String userId);
}
