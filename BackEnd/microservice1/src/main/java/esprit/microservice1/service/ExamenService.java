package esprit.microservice1.service;

import esprit.microservice1.entities.User;
import esprit.microservice1.entities.UserExamenDTO;
import esprit.microservice1.entity.*;
import esprit.microservice1.repository.ExamenParticipantRepository;
import esprit.microservice1.repository.ExamenRepository;
import esprit.microservice1.repository.FormationRepository;
import esprit.microservice1.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;


import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExamenService {
    @Autowired
    private ExamenRepository examenRepository;
    @Autowired
    private FormationRepository formationRepository;
    @Autowired
    private UsersRepo usersRepo;
    @Autowired
    private ExamenParticipantRepository examenParticipantRepository;


    public List<Examen> getAllExamens() {
        return examenRepository.findAll();
    }
    public List<Examen> getAllExamensbyFormation(Long ifformation) {
        Formation formation = formationRepository.findById(ifformation).get();

        return examenRepository.findAllByFormation(formation);
    }

    public Examen addExamen(Examen examen,Long formation) {

        Formation formation1=formationRepository.findById(formation).get();
        examen.setFormation(formation1);
        return examenRepository.save(examen);
    }

    public Examen updateExamen(Long id, Examen examenDetails) {
        return examenRepository.findById(id).map(examen -> {
            examen.setTitre(examenDetails.getTitre());
            examen.setDate(examenDetails.getDate());
            examen.setDuree(examenDetails.getDuree());
            examen.setExamenT(examenDetails.getExamenT());
            examen.setSession(examenDetails.getSession());
            return examenRepository.save(examen);
        }).orElseThrow(() -> new RuntimeException("Examen non trouvé"));
    }

    public String deleteExamen(Long id) {
        if (examenRepository.existsById(id)) {
            examenRepository.deleteById(id);
            return "Examen avec ID " + id + " supprimé avec succès.";
        } else {
            throw new RuntimeException("Examen avec ID " + id + " non trouvé.");
        }
    }


    public List<UserExamenDTO> getUserWithNotesByExamen(Long examenId) {
        Examen examen = examenRepository.findById(examenId)
                .orElseThrow(() -> new RuntimeException("Examen non trouvé"));

        List<ExamenParticipant> participants = examenParticipantRepository.findByExamen(examen);
        List<UserExamenDTO> result = new ArrayList<>();

        for (ExamenParticipant participant : participants) {
            Integer userId = participant.getUserId();

            User user = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/api/users/userById")
                            .build())
                    .header("userId", userId.toString())
                    .retrieve()
                    .bodyToMono(User.class)
                    .block();

            if (user != null) {
                result.add(new UserExamenDTO(user, participant.getNote(), participant.getMoyenne(),participant.getId()));
            }
        }

        return result;
    }




    @Autowired
    private WebClient webClient;

    public String assignUserToExamen(Long examenId, Integer userId) {
        Optional<Examen> examenOpt = examenRepository.findById(examenId);
        User user = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/users/userById")
                        .build())
                .header("userId", userId.toString())
                .retrieve()
                .bodyToMono(User.class)
                .block();
        if (examenOpt.isPresent()) {
            Examen examen = examenOpt.get();


            ExamenParticipant participant = new ExamenParticipant();
            participant.setExamen(examen);
            participant.setUserId(user.getUserId());
            participant.setNote(0.0);
            participant.setMoyenne(0.0);

            examenParticipantRepository.save(participant);
            return "Utilisateur affecté à l'examen avec succès.";
        } else {
            return "Examen ou utilisateur non trouvé.";
        }
    }
    public String updateUserToExamen(Long id, Double note) {
        ExamenParticipant participant = examenParticipantRepository.findById(id).get();

        if (participant != null) {
            participant.setNote(note);

            examenParticipantRepository.save(participant);
            return "Note affecté à l'examen avec succès.";
        } else {
            return "Note ou utilisateur non trouvé.";
        }
    }

public Double getMoyenne(Long idFormation, Integer userId) {
    User user = webClient.get()
            .uri(uriBuilder -> uriBuilder
                    .path("/api/users/userById")
                    .build())
            .header("userId", userId.toString())
            .retrieve()
            .bodyToMono(User.class)
            .block();
    if (user == null) return null;
    List<Examen> examens = examenRepository.findByFormationId(idFormation);
    if (examens.isEmpty()) return 0.0;
    List<ExamenParticipant> participations = examenParticipantRepository.findByUserIdAndExamenIn(user.getUserId(), examens);
    if (participations.isEmpty()) return 0.0;
    double total = 0.0;
    int count = 0;
    for (ExamenParticipant ep : participations) {
        if (ep.getMoyenne() != null) {
            total += ep.getMoyenne();
            count++;
        }
    }

    return count > 0 ? total / count : 0.0;
}

    public String calculerEtEnregistrerMoyenneParUtilisateur(Long formationId) {
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation non trouvée"));

        List<Examen> examenList = examenRepository.findAllByFormation(formation);

        List<ExamenParticipant> allParticipants = examenParticipantRepository.findAll()
                .stream()
                .filter(p -> examenList.contains(p.getExamen()))
                .collect(Collectors.toList());

        if (allParticipants.isEmpty()) {
            return "Aucune note trouvée pour cette formation.";
        }

        Map<Integer, List<Double>> notesParUtilisateur = new HashMap<>();

        for (ExamenParticipant participant : allParticipants) {
            if (participant.getNote() != null) {
                Integer userId = Integer.valueOf(participant.getUserId());
                notesParUtilisateur
                        .computeIfAbsent(userId, k -> new ArrayList<>())
                        .add(participant.getNote());
            }
        }

        for (Map.Entry<Integer, List<Double>> entry : notesParUtilisateur.entrySet()) {
            Integer userId = entry.getKey();
            List<Double> notes = entry.getValue();
            double moyenne = notes.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);

            for (ExamenParticipant participant : allParticipants) {
                if (participant.getUserId().equals(userId)) {
                    participant.setMoyenne(moyenne);
                    examenParticipantRepository.save(participant);
                }
            }
        }

        return "Moyennes calculées et enregistrées avec succès.";
    }

    public List<ExamenParticipant> getallexamen(Integer id) {
        User user = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/users/userById")
                        .build())
                .header("userId", id.toString())
                .retrieve()
                .bodyToMono(User.class)
                .block();

        if (user == null) {
            throw new RuntimeException("Utilisateur non trouvé");
        }

        return examenParticipantRepository.findByUserId(user.getUserId());
    }








}
