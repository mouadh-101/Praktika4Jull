package org.esprit.user.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.esprit.user.entities.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    User findByEmail(String email);
    //for internship
    @Query("SELECT u.userId FROM User u")
    List<String> findAllUserIds();
    @Query("SELECT u.email FROM User u WHERE u.userId = :userId")
    String findEmailByUserId(String userId);



}
