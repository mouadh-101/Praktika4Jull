package tn.esprit.intershipproccess.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.intershipproccess.entity.Requirement;

import java.util.List;

public interface RequirementRepository extends JpaRepository<Requirement,Integer> {
    Requirement findByName(String name);
    List<Requirement> findByField(String field);
}
