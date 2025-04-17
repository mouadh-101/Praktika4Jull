package tn.esprit.intershipproccess.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.intershipproccess.entity.Company;
import tn.esprit.intershipproccess.entity.Internship;
import tn.esprit.intershipproccess.repository.CompanyRepository;
import tn.esprit.intershipproccess.service.CompanyService;
import tn.esprit.intershipproccess.service.InternshipService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;


@RestController
@RequestMapping("/api/internships/company")
public class CompanyController{
    @Autowired
    private CompanyService companyService;
    private final String UPLOAD_DIR = "C:/Users/TAYSSIR/Desktop/takwapi/integrationnew/PraktikaIntegration/Praktika/FrontEnd/src/assets/uploads/";
    @Autowired
    private CompanyRepository companyRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addCompany(@RequestBody Company company){
        Company savedCompany = companyService.addCompany(company);
        return new ResponseEntity<>(savedCompany, HttpStatus.CREATED);
    }
    @PutMapping("/update")
    public Company updateCompany(@RequestBody Company company ,@RequestHeader("userId") String id) {
        return companyService.updateCompany(company,id);
    }
    @GetMapping
    public ResponseEntity<Company> getComapany(@RequestHeader("userId") String id)
    {
        Optional<Company> company = companyService.getCompanyById(id);
        if (company.isPresent()) {
            return new ResponseEntity<>(company.get(), HttpStatus.OK);
        } else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
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
    @PostMapping(value = "/profile-picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // Ensure upload directory exists
            Files.createDirectories(Paths.get(UPLOAD_DIR));

            // Generate a unique filename
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + filename);

            // Save the file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Return file URL
            String fileUrl = "/uploads/" + filename;
            return ResponseEntity.ok(Collections.singletonMap("fileUrl", fileUrl));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "File upload failed!"));
        }
    }
}
