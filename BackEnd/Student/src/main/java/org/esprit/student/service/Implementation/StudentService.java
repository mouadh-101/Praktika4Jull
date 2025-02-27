package org.esprit.student.service.Implementation;


import org.esprit.student.entity.*;
import org.esprit.student.repository.StudentRepository;
import org.esprit.student.service.Interface.IStudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;


@Service
public class StudentService implements IStudentService {
    @Autowired
    StudentRepository studentRepository;
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

}
