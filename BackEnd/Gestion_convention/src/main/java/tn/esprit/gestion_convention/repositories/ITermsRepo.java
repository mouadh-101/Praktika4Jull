package tn.esprit.gestion_convention.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import tn.esprit.gestion_convention.entities.Terms;

import java.util.List;
import java.util.Optional;

@Repository
public interface ITermsRepo extends JpaRepository<Terms, Integer>, JpaSpecificationExecutor<Terms> {


}
