package esprit.microservice1.entities;

public class UserExamenDTO {
    private User user;
    private Long id;
    private Double note;
    private Double moyenne;

    // Constructeur
    public UserExamenDTO(User user, Double note, Double moyenne,Long id) {
        this.id=id;
        this.user = user;
        this.note = note;
        this.moyenne = moyenne;
    }

    // Getters et setters
    public User getUser() {
        return user;
    }

    public Long getId() {
        return id;
    }

    public UserExamenDTO setId(Long id) {
        this.id = id;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
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
