package esprit.microservice1.entity;

import jakarta.persistence.*;

@Entity
public class ExamenParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne

    @JoinColumn(name = "examen_id")
    private Examen examen;


    @Column(name = "user_id")
    private Integer userId;

    private Double note;

    private Double moyenne;

    // Getters et setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Examen getExamen() {
        return examen;
    }

    public void setExamen(Examen examen) {
        this.examen = examen;
    }

    public Integer getUserId() {
        return userId;
    }

    public ExamenParticipant setUserId(Integer userId) {
        this.userId = userId;
        return this;
    }

    public Double getNote() {
        return note;
    }

    public void setNote(Double note) {
        this.note = note;
    }

    public Double getMoyenne() {
        return moyenne;
    }

    public void setMoyenne(Double moyenne) {
        this.moyenne = moyenne;
    }




}
