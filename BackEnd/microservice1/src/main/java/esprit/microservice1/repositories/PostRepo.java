package esprit.microservice1.repositories;

import esprit.microservice1.entities.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PostRepo extends JpaRepository<Post, Integer> {
    @Query("SELECT p FROM Post p WHERE (:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:date IS NULL OR p.datePost = :date)")
    List<Post> searchByNameAndDate(@Param("name") String name, @Param("date") LocalDate date);
}
