package org.esprit.student.repository;

import org.esprit.student.controller.dto.ASIDto;
import org.esprit.student.controller.dto.ApplicationDto;
import org.esprit.student.controller.dto.ApplicationStatisticsDto;
import org.esprit.student.controller.dto.StatsDto;
import org.esprit.student.entity.Application;
import org.esprit.student.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application,Long> {
    ApplicationDto findAppById(Long id);
    List<ApplicationDto> findByStudent(Student student);
    List<ApplicationDto> findByInternshipIdIn(List<Long> internshipIds);
    @Query("SELECT new org.esprit.student.controller.dto.ApplicationStatisticsDto(" +
            "COUNT(a), " +
            "SUM(CASE WHEN a.status = 'PENDING' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN a.status = 'ACCEPTED' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN a.status = 'REJECTED' THEN 1 ELSE 0 END)) " +
            "FROM Application a WHERE a.student.userId = :userId")
    ApplicationStatisticsDto getApplicationStatisticsByUserId(@Param("userId") String userId);
}
