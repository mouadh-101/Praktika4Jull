package tn.esprit.gestion_convention.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Terms {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer TermId;
    String Title;
    String Description;
    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL)
    Convention convention;

    public Integer getTermId() {
        return TermId;
    }

    public void setTermId(Integer termId) {
        TermId = termId;
    }

    public String getTitle() {
        return Title;
    }

    public void setTitle(String title) {
        Title = title;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String description) {
        Description = description;
    }

    public Convention getConvention() {
        return convention;
    }

    public void setConvention(Convention convention) {
        this.convention = convention;
    }
}
