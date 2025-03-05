package org.esprit.student.service.Implementation;


import org.esprit.student.entity.*;
import org.esprit.student.repository.StudentRepository;
import org.esprit.student.service.Interface.IStudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
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
            if (student.getProfilePic() != null) {
                exstudent.setProfilePic(student.getProfilePic());
            }
            if (student.getFieldOfStudy() != null) {
                exstudent.setFieldOfStudy(student.getFieldOfStudy());
            }
            if (student.getFieldOfStudy() != null) {
                exstudent.setDateOfBirth(student.getDateOfBirth());
            }
            if (student.getBio() != null) {
                exstudent.setBio(student.getBio());
            }
            if (student.getSkills() != null) {
                exstudent.setSkills(student.getSkills());
            }
            if (student.getExtraActivities() != null) {
                exstudent.setExtraActivities(student.getExtraActivities());
            }
            if (student.getEducations() != null) {
                exstudent.setEducations(student.getEducations());
            }
            if (student.getExtraActivities() != null) {
                exstudent.setExtraActivities(student.getExtraActivities());
            }
            return studentRepository.save(exstudent);
        }
        return student;
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
    public List<String> getAllSkillsNames(String userId) {
        return studentRepository.findSkillNamesByStudentId(userId);
    }

}
