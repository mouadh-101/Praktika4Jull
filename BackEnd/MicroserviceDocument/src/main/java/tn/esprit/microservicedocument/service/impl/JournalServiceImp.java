package tn.esprit.microservicedocument.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.microservicedocument.entities.Document;
import tn.esprit.microservicedocument.entities.Journal;
import tn.esprit.microservicedocument.repository.IDocumentRepository;
import tn.esprit.microservicedocument.repository.IJournalRepository;
import tn.esprit.microservicedocument.service.IJournalService;

import java.util.ArrayList;
import java.util.List;
@Service
@AllArgsConstructor
public class JournalServiceImp implements IJournalService {
    IJournalRepository journalRepository;
    private IDocumentRepository documentRepository;
    @Override

    public Journal addJournal(Journal journal, Long idStage) {
        Document stage = documentRepository.findById(idStage).orElseThrow(() -> new RuntimeException("Stage non trouvé"));
        journal.setDocument(stage);
        documentRepository.save(stage);
        return journalRepository.save(journal);
    }


    @Override
    public List<Journal> getJournalByStageId(Long stageId) {
        Document stage = documentRepository.findById(stageId)
                .orElseThrow(() -> new RuntimeException("Stage non trouvé avec l'ID: " + stageId));

        return new ArrayList<>(stage.getJournals());
    }


    @Override
    public void removeJournal(Long idJournal) {
        journalRepository.deleteById(idJournal);

    }
    @Override
    public Journal getJournalById(Long id) {
        return journalRepository.findById(id).orElse(null);
    }

}
