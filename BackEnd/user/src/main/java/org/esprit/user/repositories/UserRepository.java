package org.esprit.user.repositories;


import org.esprit.user.controllers.Dto.UserStatisticDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.esprit.user.entities.User;
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
    @Query("SELECT COUNT(CASE WHEN u.role = 'STUDENT' THEN 1 END) AS studentCount, " +
            "COUNT(CASE WHEN u.role = 'COMPANY' THEN 1 END) AS companyCount, " +
            "COUNT(u.id) AS totalUsers " +
            "FROM User u")
    UserStatisticDTO getUserStatistics();




}
