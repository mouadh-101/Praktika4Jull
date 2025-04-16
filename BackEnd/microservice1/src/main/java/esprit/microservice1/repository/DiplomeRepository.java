package esprit.microservice1.repository;


import esprit.microservice1.entity.Diplome;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface DiplomeRepository extends JpaRepository<Diplome, Long> {
}
