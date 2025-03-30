package tn.esprit.microservicedocument.service;

import org.springframework.web.multipart.MultipartFile;
import tn.esprit.microservicedocument.entities.Depot;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface IDepotService {
    Optional<Depot> findDepotById(Long id);

    Depot addDocument(MultipartFile rapport, MultipartFile journal, MultipartFile attestation) throws IOException;

    List<Depot> findAllDepots();

    void deleteDepot(Long id);

    Depot updateDepot(Long id, MultipartFile rapport, MultipartFile journal, MultipartFile attestation) throws IOException;
}
