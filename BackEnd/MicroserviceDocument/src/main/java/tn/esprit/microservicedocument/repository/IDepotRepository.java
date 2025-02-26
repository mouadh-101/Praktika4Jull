package tn.esprit.microservicedocument.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.microservicedocument.entities.Depot;
import tn.esprit.microservicedocument.entities.Document;


public interface IDepotRepository extends JpaRepository<Depot,Long> {
}
