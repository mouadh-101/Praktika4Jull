package tn.esprit.gestion_convention.services;

import tn.esprit.gestion_convention.entities.Convention;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface IConventionService {

    List<Convention> getAllConventions();
    Convention getConventionById(Integer id);
    Convention saveConvention(Convention convention);
    void deleteConvention(Integer id);
    public Convention updateConvention(Integer id, Convention convention);


    Convention affecterTerm(Integer id, Integer idTerm);

    List<Convention> filterConventionsByDate(Date startDate, Date endDate);
    // Méthode pour récupérer le nombre de conventions dans une période donnée
    Long countConventionsByMonthAndYear(int month, int year);

    List<Convention> intelligentSearch(String keyword, Boolean signedStatus);
    byte[] generatePdf(Integer id) throws Exception;
    // Nouvelle méthode pour les statistiques
    Map<Date, Map<String, Long>> getConventionStatisticsByDate(Date startDate, Date endDate);
}
