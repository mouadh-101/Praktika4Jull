package tn.esprit.gestion_convention.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Convention {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer ConId;
    @Temporal(TemporalType.TIMESTAMP)
    Date DateConv;
    String Description;
    Boolean signed;
    int InternshipId;
    @Column(columnDefinition = "TEXT") // Pour stocker une signature cryptée (base64 ou autre)
    private String encryptedSignature;
    @OneToMany(mappedBy = "convention", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Terms> terms;
    public String getEncryptedSignature() {
        return encryptedSignature;
    }

    public void setEncryptedSignature(String encryptedSignature) {
        this.encryptedSignature = encryptedSignature;
    }
    public Integer getConId() {
        return ConId;
    }

    public void setConId(Integer conId) {
        ConId = conId;
    }

    public Date getDateConv() {
        return DateConv;
    }

    public void setDateConv(Date dateConv) {
        DateConv = dateConv;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String description) {
        Description = description;
    }

    public Boolean getSigned() {
        return signed;
    }

    public void setSigned(Boolean signed) {
        this.signed = signed;
    }

    public int getInternshipId() {
        return InternshipId;
    }

    public void setInternshipId(int internshipId) {
        InternshipId = internshipId;
    }

    public List<Terms> getTerms() {
        return terms;
    }

    public void setTerms(List<Terms> terms) {
        this.terms = terms;
    }
}
