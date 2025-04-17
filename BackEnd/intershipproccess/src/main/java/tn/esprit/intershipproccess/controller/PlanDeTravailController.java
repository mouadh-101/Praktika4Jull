package tn.esprit.intershipproccess.controller;


import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.intershipproccess.entity.PlanDeTravail;
import tn.esprit.intershipproccess.entity.PlanDeTravailDto;
import tn.esprit.intershipproccess.repository.PlanDeTravailRepository;
import tn.esprit.intershipproccess.service.PlanDeTravailService;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
@RestController
@RequestMapping("/api/internships/plan-travail")
public class PlanDeTravailController {

    @Autowired
    private PlanDeTravailService planDeTravailService;
    @Autowired
    private PlanDeTravailRepository planDeTravailRepository;
    @PostMapping("/add")
    public ResponseEntity<PlanDeTravail> addPlan(@RequestBody PlanDeTravail plan) {
        PlanDeTravail savedPlan = planDeTravailService.createPlanDeTravail(plan);
        return ResponseEntity.ok(savedPlan);
    }

    @GetMapping("/plans")
    public List<PlanDeTravailDto> getAllPlans() {
        return planDeTravailService.getAllPlans();
    }

    @GetMapping("/download")
    public ResponseEntity<InputStreamResource> downloadPlan(@RequestParam("id") Long id, HttpServletResponse response) throws DocumentException, IOException {
        // Récupérer le PlanDeTravail depuis la base de données
        PlanDeTravail plan = planDeTravailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        // Créer le PDF avec iText
        Document document = new Document();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, baos);
        document.open();
        document.add(new Paragraph("Plan de Travail: " + plan.getDescription()));
        document.add(new Paragraph("Description: " + plan.getDescription()));
        document.add(new Paragraph("Problématique: " + plan.getProblematique()));
        document.add(new Paragraph("Fonctionnalités: " + plan.getFonctionnalites()));
        document.add(new Paragraph("Technologies: " + plan.getTechnologies()));
        document.add(new Paragraph("Entreprise: " + plan.getCompany()));
        document.add(new Paragraph("Encadrant: " + plan.getEncadrantInterne()));
        document.close();

        InputStreamResource resource = new InputStreamResource(new ByteArrayInputStream(baos.toByteArray()));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=plan_de_travail_" + plan.getId() + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(baos.size())
                .body(resource);
    }


}
