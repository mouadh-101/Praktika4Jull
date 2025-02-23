package org.esprit.user.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.esprit.user.entities.User;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    User findByEmail(String email);
}
