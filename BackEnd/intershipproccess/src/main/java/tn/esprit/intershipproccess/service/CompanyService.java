package tn.esprit.intershipproccess.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.intershipproccess.entity.Company;
import tn.esprit.intershipproccess.entity.Internship;
import tn.esprit.intershipproccess.repository.CompanyRepository;
import tn.esprit.intershipproccess.repository.InternshipRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CompanyService {
    @Autowired
    private CompanyRepository companyRepository;

    public Company addCompany(Company company){
        return companyRepository.save(company);
    }

    public void deleteCompany(int idCompany){
        companyRepository.deleteById(idCompany);
    }
    public List<Company> GetAllCompany(){
        return  companyRepository.findAll();
    }
    public Optional<Company> getCompanyById(int idCompany) {
        return companyRepository.findById(idCompany);
    }


}
