package tn.esprit.intershipproccess.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.intershipproccess.entity.Requirement;

public interface RequirementRepository extends JpaRepository<Requirement,Integer> {
    Requirement findByName(String name);
}
