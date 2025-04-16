package esprit.microservice1.repository;


import esprit.microservice1.entity.Examen;
import esprit.microservice1.entity.Formation;
import esprit.microservice1.entity.OurUsers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;


@Repository
public interface ExamenRepository extends JpaRepository<Examen, Long> {
        List<Examen> findAllByFormation(Formation formation);


    List<Examen> findByDate(LocalDate dateCible);

    List<Examen> findByFormationId(Long idFormation);

    @Query("SELECT e FROM Examen e JOIN e.participants p WHERE p.userId = :userId")
    List<Examen> findByParticipantsId(@Param("userId") Long userId);

//    List<Examen> findAllByParticipants(OurUsers ourUsers);



//    List<Examen> findByCourseId(Long idFormation);
}


