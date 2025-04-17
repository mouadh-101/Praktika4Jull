package tn.esprit.microservicedocument.service;

import tn.esprit.microservicedocument.entities.Journal;

import java.util.List;

public interface IJournalService {
    Journal addJournal(Journal journal, Long idStage);

    List<Journal> getJournalByStageId(Long stageId);

    void removeJournal(Long idJournal);

    Journal getJournalById(Long id);
}
