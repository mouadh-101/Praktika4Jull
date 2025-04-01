package org.esprit.student.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ExtraActivities {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
<<<<<<< HEAD
=======
    String title;
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
    String description;
    @ManyToOne
    @JsonIgnore
    private Student student;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }
<<<<<<< HEAD
=======

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
}
