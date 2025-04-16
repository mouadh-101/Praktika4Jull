package tn.esprit.microservicedocument.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.microservicedocument.entities.Depot;
import tn.esprit.microservicedocument.entities.Document;
import tn.esprit.microservicedocument.repository.IDepotRepository;
import tn.esprit.microservicedocument.repository.IDocumentRepository;
import tn.esprit.microservicedocument.service.IDepotService;

import java.io.IOException;
import java.util.Date;
import java.util.Optional;

@Service
public class DepotServiceImpl implements IDepotService {

    @Autowired
    private IDepotRepository depotRepository;
    @Autowired
    private IDocumentRepository documentRepository;

    @Override
    public Optional<Depot> findDepotById(Long id) {
        return depotRepository.findById(id);
    }

    @Override
    public Depot addDocument(MultipartFile rapport, MultipartFile journal, MultipartFile attestation, Long idDocument) throws IOException {
        Document document = documentRepository.findById(idDocument)
                .orElseThrow(() -> new RuntimeException("Document non trouvé"));
        Depot depot = new Depot();
        depot.setDocument(document);
        if (rapport != null && !rapport.isEmpty()) {
            depot.setRapport(rapport.getBytes());
        }
        if (journal != null && !journal.isEmpty()) {
            depot.setJournal(journal.getBytes());
        }
        if (attestation != null && !attestation.isEmpty()) {
            depot.setAttestation(attestation.getBytes());
        }
        depot.setUploadDate(new Date());
        return depotRepository.save(depot);
    }

    @Override
    public Depot findDepotsbyIdDocument(Long idDocument) {

        Document document = documentRepository.findById(idDocument)
                .orElseThrow(() -> new RuntimeException("Document non trouvé avec l'ID: " + idDocument));

        return document.getDepot();
    }

    @Override
    public void deleteDepot(Long id) {
        depotRepository.deleteById(id);

    }


    @Override
    public Depot updateDepot(Long id, MultipartFile rapport, MultipartFile journal, MultipartFile attestation) throws IOException {
        Optional<Depot> existingDepotOptional = depotRepository.findById(id);
        if (existingDepotOptional.isPresent()) {
            Depot existingDepot = existingDepotOptional.get();
            if (rapport != null && !rapport.isEmpty()) {
                existingDepot.setRapport(rapport.getBytes());
            }
            if (journal != null && !journal.isEmpty()) {
                existingDepot.setJournal(journal.getBytes());
            }
            if (attestation != null && !attestation.isEmpty()) {
                existingDepot.setAttestation(attestation.getBytes());
            }
            existingDepot.setUploadDate(new Date());
            return depotRepository.save(existingDepot);
        } else {
            throw new RuntimeException("Depot non trouvé avec l'ID : " + id);
        }
    }

}
