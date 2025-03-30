package tn.esprit.gestion_convention.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.gestion_convention.entities.Convention;
import tn.esprit.gestion_convention.entities.Terms;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface IConventionRepo extends JpaRepository<Convention, Integer>, JpaSpecificationExecutor<Convention> {
    // Nouvelle méthode pour récupérer les conventions entre deux dates

    // Requête pour compter le nombre de conventions par mois et année
    @Query("SELECT COUNT(c) FROM Convention c " +
            "WHERE MONTH(c.DateConv) = :month AND YEAR(c.DateConv) = :year")
    Long countConventionsByMonthAndYear(int month, int year);

    // Recherche intelligente avec jointure entre le deux entite
    @Query("SELECT DISTINCT c FROM Convention c " +
            "LEFT JOIN c.terms t " +
            "WHERE (:signed IS NULL OR c.signed = :signed) " +
            "AND (LOWER(c.Description) LIKE LOWER(CONCAT('%',:keyword,'%')) " +
            "OR LOWER(t.Title) LIKE LOWER(CONCAT('%',:keyword,'%')))")
    List<Convention> intelligentSearch(
            @Param("keyword") String keyword,
            @Param("signed") Boolean signedStatus
    );
}
