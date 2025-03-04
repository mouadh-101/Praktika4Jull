package tn.esprit.intershipproccess.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tn.esprit.intershipproccess.entity.Requirement;
import tn.esprit.intershipproccess.repository.RequirementRepository;

import java.util.List;

@RestController
@RequestMapping("/api/internships/requirements")
public class RequirementController {
    @Autowired
    RequirementRepository requirementRepository;

    @GetMapping("/by-field")
    public List<Requirement> getRequirementsByField(@RequestParam String field) {
        return requirementRepository.findByField(field);
    }
}
