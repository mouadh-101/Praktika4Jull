package tn.esprit.intershipproccess.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.intershipproccess.entity.Internship;

import java.math.BigDecimal;
import java.util.List;

public interface InternshipRepository extends JpaRepository<Internship,Integer> {
    @Query("SELECT i FROM Internship i WHERE (:location IS NULL OR i.location LIKE %:location%) " +
            "AND (:duration IS NULL OR i.duration = :duration) " +
            "AND (:compensation IS NULL OR i.compensation = :compensation) " +
            "AND (:field IS NULL OR i.field LIKE %:field%) " +
            "AND (:remote IS NULL OR i.remote = :remote)")
    List<Internship> findByFilters(@Param("location") String location,
                                   @Param("duration") Integer duration,
                                   @Param("compensation") BigDecimal compensation,
                                   @Param("field") String field,
                                   @Param("remote") Boolean remote);

}
