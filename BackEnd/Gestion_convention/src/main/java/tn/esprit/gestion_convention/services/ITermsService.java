package tn.esprit.gestion_convention.services;

import org.springframework.stereotype.Service;
import tn.esprit.gestion_convention.entities.Terms;
import tn.esprit.gestion_convention.repositories.ITermsRepo;

import java.util.List;

@Service
public interface ITermsService {
  List<Terms> getAllTerms();
  Terms getTermsById(Integer id);
  Terms saveTerms(Terms terms);
  void deleteTerms(Integer id);


  Terms updateTerms(Integer id, Terms term);
}
