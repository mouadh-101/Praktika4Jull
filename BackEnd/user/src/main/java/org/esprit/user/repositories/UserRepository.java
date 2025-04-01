package org.esprit.user.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.esprit.user.entities.User;
<<<<<<< HEAD
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    User findByEmail(String email);
=======
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    //forchat
    Optional<User> findByEmail(String email);

    //for internship
    @Query("SELECT u.userId FROM User u")
    List<String> findAllUserIds();
    @Query("SELECT u.email FROM User u WHERE u.userId = :userId")
    String findEmailByUserId(String userId);

    @Query("SELECT u.userId FROM User u WHERE u.email = :email")
    String findUserIdByEmail(String email);





>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
}
