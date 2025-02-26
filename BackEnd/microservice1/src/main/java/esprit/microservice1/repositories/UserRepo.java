package esprit.microservice1.repositories;

import esprit.microservice1.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository <User , Integer> {
}
