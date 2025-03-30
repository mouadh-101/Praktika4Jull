package tn.esprit.microservicedocument.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.microservicedocument.entities.Depot;
import tn.esprit.microservicedocument.repository.IDepotRepository;
import tn.esprit.microservicedocument.service.IDepotService;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class DepotServiceImpl implements IDepotService {

    @Autowired
    private IDepotRepository depotRepository;

    @Override
    public Optional<Depot> findDepotById(Long id) {
        return depotRepository.findById(id);
    }

    @Override
    public Depot addDocument(MultipartFile rapport, MultipartFile journal, MultipartFile attestation) throws IOException {
        Depot depot = new Depot();
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
    public List<Depot> findAllDepots() {
        return depotRepository.findAll();
    }

    @Override
    public void deleteDepot(Long id) {
        if (depotRepository.existsById(id)) {
            depotRepository.deleteById(id);
        } else {
            throw new RuntimeException("Depot non trouvé pour l'ID: " + id);
        }
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
