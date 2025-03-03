package tn.esprit.intershipproccess.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.intershipproccess.entity.Company;
import tn.esprit.intershipproccess.entity.Internship;
import tn.esprit.intershipproccess.service.CompanyService;
import tn.esprit.intershipproccess.service.InternshipService;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/internships/company")
public class CompanyController{
    @Autowired
    private CompanyService companyService;
    @PostMapping("/add")
    public ResponseEntity<?> addCompany(@RequestBody Company company){
        Company savedCompany = companyService.addCompany(company);
        return new ResponseEntity<>(savedCompany, HttpStatus.CREATED);
    }
    @GetMapping("/getById/{idCompany}")
    public ResponseEntity<Company> getCompanyById(@PathVariable("idCompany") String idCompany) {
        Optional<Company> company = companyService.getCompanyById(idCompany);
        if (company.isPresent()) {
            return new ResponseEntity<>(company.get(), HttpStatus.OK);
        } else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
