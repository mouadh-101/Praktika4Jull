package tn.esprit.microservicedocument.restController;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.microservicedocument.entities.Document;
import tn.esprit.microservicedocument.entities.Journal;
import tn.esprit.microservicedocument.repository.IJournalRepository;
import tn.esprit.microservicedocument.service.IDocumentService;
import tn.esprit.microservicedocument.service.IJournalService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/journals")
@CrossOrigin(origins = "http://localhost:4200")
@AllArgsConstructor
public class JournalRestControlleur {
    @Autowired
    IJournalService journalService;
    @Autowired
    IJournalRepository journalRepository;

    @PutMapping("/update/{id}")
    public ResponseEntity<Journal> updateJournal(@PathVariable Long id, @RequestBody Journal updatedJournal) {
        return journalRepository.findById(id)
                .map(existingJournal -> {
                    existingJournal.setTache(updatedJournal.getTache());
                    existingJournal.setDateJournal(updatedJournal.getDateJournal());
                    // NE PAS SET document pour ne pas l'effacer !
                    return ResponseEntity.ok(journalRepository.save(existingJournal));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/add/{idStage}")//http://localhost:8090/api/journal/add
    public ResponseEntity<Journal> addJournal(@RequestBody Journal journal, @PathVariable Long idStage){


        Journal newJournal = journalService.addJournal(journal,idStage);

        return new ResponseEntity<>(newJournal, HttpStatus.CREATED);
    }
    @GetMapping("/listaffecter/{id}")
    public ResponseEntity<List<Journal>> getJournalByIdStage(@PathVariable Long id) {
        try {
            List<Journal> journals = journalService.getJournalByStageId(id);
            return ResponseEntity.ok(journals);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") Long id){
        journalService.removeJournal(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/journal/{id}")
    public ResponseEntity<Journal> getJournalById(@PathVariable Long id) {
        Journal journal = journalService.getJournalById(id);
        if (journal != null) {
            return ResponseEntity.ok(journal);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}
