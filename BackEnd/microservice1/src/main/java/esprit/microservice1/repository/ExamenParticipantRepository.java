package esprit.microservice1.repository;

import esprit.microservice1.dto.UserNoteDTO;
import esprit.microservice1.entities.User;
import esprit.microservice1.entity.Examen;
import esprit.microservice1.entity.ExamenParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository
public interface ExamenParticipantRepository extends JpaRepository<ExamenParticipant, Long> {


    List<ExamenParticipant> findByUserIdAndExamenIn(Integer user, List<Examen> examens);

    List<ExamenParticipant> findByUserId(Integer userId);

//
//    List<ExamenParticipant> findByUser(User user);
//    ExamenParticipant findAllByUserAndExamen(User user,Examen examen);
//
//    ExamenParticipant getExamenParticipantByUser(User user);
    @Query("SELECT ep.userId AS userId, AVG(ep.note) AS moyenne " +
            "FROM ExamenParticipant ep " +
            "WHERE ep.examen.formation.id = :formationId " +
            "GROUP BY ep.userId")
    List<UserNoteDTO> findUserMoyenneByFormationId(@Param("formationId") Long formationId);
//    List<ExamenParticipant> findByUserAndExamenIn(User user, List<Examen> examens);

    List<ExamenParticipant> findByExamen(Examen examen);

    Optional<ExamenParticipant> findByUserIdAndExamen(Integer userId, Examen exam);
}
