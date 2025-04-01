package org.esprit.student.controller;

<<<<<<< HEAD
import org.esprit.student.entity.Student;
import org.esprit.student.service.Interface.IStudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/Student")
public class StudentController {
    @Autowired
    IStudentService studentService;
=======

import jakarta.servlet.http.HttpServletResponse;
import org.esprit.student.controller.dto.UserDto;
import org.esprit.student.entity.Student;
import org.esprit.student.service.Interface.IStudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.io.IOException;
import java.nio.file.Files;

import java.nio.file.StandardCopyOption;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/Student")

public class StudentController {
    @Autowired
    IStudentService studentService;
    private final String UPLOAD_DIR = "C:/Users/TAYSSIR/Desktop/takwapi/integrationnew/PraktikaIntegration/Praktika/FrontEnd/src/assets/uploads/";
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
    @PostMapping("/add")
    public Student addStudent(@RequestBody Student student)
    {
        return studentService.addStudent(student);
    }
    @GetMapping
    public ResponseEntity<Student> getStudent(@RequestHeader("userId") String id)
    {
        return studentService.getStudent(id);
    }
    @DeleteMapping("/delete")
    public void deleteStudent(@RequestHeader("userId")String id) {
        studentService.deleteStudent(id);
    }
    @PutMapping("/update")
    public Student updateStudent(@RequestBody Student student ,@RequestHeader("userId") String id) {
        return studentService.updateStudent(id,student);
    }
<<<<<<< HEAD



}
=======
    @GetMapping("/AllSkillsNames/{userId}")
    List<String> getAllSkillsNames(@PathVariable("userId") String userId){
        return studentService.getAllSkillsNames(userId);
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
    @PostMapping("/export-pdf/{template}")
    public void exportPdf(@RequestBody UserDto user, @RequestHeader("userId") String userId, HttpServletResponse response,@PathVariable("template") String template) {
        studentService.exportPdf(response, user, userId,template);
    }
}




>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
