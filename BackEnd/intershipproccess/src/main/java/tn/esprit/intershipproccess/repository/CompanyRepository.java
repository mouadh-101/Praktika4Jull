package tn.esprit.intershipproccess.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.intershipproccess.entity.Company;

public interface CompanyRepository extends JpaRepository<Company,String> {
}
