package esprit.microservice1.repository;

import esprit.microservice1.entity.Formation;
import esprit.microservice1.entity.OurUsers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;


@Repository
public interface FormationRepository extends JpaRepository <Formation, Long> {

   List<Formation> findAllByUserIds(Integer id);

   Optional<Formation> findByTitre(String titre);
}
