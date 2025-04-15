package org.esprit.student.service.Implementation;


import jakarta.servlet.http.HttpServletResponse;
import org.esprit.student.controller.dto.UserDto;
import org.esprit.student.entity.*;
import org.esprit.student.repository.StudentRepository;
import org.esprit.student.service.Interface.IStudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.util.List;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Map;


@Service
public class StudentService implements IStudentService {
    @Autowired
    StudentRepository studentRepository;
    @Autowired
    private SpringTemplateEngine templateEngine;
    @Override
    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }

    @Override
    public Student updateStudent(String id, Student student) {
        Student exstudent = studentRepository.findById(id).orElse(null);
        if (exstudent!=null) {
            exstudent.setProfilePic(student.getProfilePic());
            exstudent.setFieldOfStudy(student.getFieldOfStudy());
            exstudent.setDateOfBirth(student.getDateOfBirth());
            exstudent.setBio(student.getBio());
            return studentRepository.save(exstudent);
        }
        return null;
    }

    @Override
    public void deleteStudent(String id) {
        studentRepository.deleteById(id);
    }

    @Override
    public ResponseEntity<Student> getStudent(String id) {
        if(studentRepository.existsById(id))
            return ResponseEntity.ok(studentRepository.findById(id).orElse(null));
        return ResponseEntity.ok(null);
    }
    @Override
    public void exportPdf(HttpServletResponse response, UserDto user, String userId, String template) {
        try {
            // Step 1: Fetch student data from the database using userId
            Student student = studentRepository.findById(userId).orElseThrow(() -> new RuntimeException("Student not found"));
            // Step 2: Prepare data for the Thymeleaf template
            Map<String, Object> data = Map.of(
                    "student", student,
                    "user", user
            );

            // Step 3: Generate the HTML content using Thymeleaf
            Context context = new Context();
            context.setVariables(data);
            String htmlContent = templateEngine.process(template, context);

            // Step 4: Convert the HTML content to PDF using Flying Saucer
            byte[] pdf = generatePdfFromHtml(htmlContent);

            // Step 5: Set response headers and write the PDF to the response
            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", "attachment; filename=resume_" + user.getName() + ".pdf");
            response.setContentLength(pdf.length);
            response.getOutputStream().write(pdf);

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            try {
                response.getWriter().write("Error generating PDF: " + e.getMessage());
            } catch (IOException ioException) {
                ioException.printStackTrace();
            }
        }
    }

    @Override
    public List<Object[]> getTopFieldsWithInternships() {
        return studentRepository.getTopFieldsWithInternships();
    }

    private byte[] generatePdfFromHtml(String htmlContent) throws Exception {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ITextRenderer renderer = new ITextRenderer();
        renderer.setDocumentFromString(htmlContent);
        renderer.layout();
        renderer.createPDF(outputStream);
        return outputStream.toByteArray();
    }


    @Override
    public List<String> getAllSkillsNames(String userId) {
        return studentRepository.findSkillNamesByStudentId(userId);
    }


}
