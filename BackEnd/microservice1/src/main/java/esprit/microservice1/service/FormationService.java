package esprit.microservice1.service;

import esprit.microservice1.dto.UserMoyenneResponse;
import esprit.microservice1.dto.UserNoteDTO;
import esprit.microservice1.entities.User;
import esprit.microservice1.entity.Formation;
import esprit.microservice1.entity.OurUsers;
import esprit.microservice1.entity.TypeFormation;
import esprit.microservice1.repository.ExamenParticipantRepository;
import esprit.microservice1.repository.FormationRepository;
import esprit.microservice1.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class FormationService {
    @Autowired
    private FormationRepository formationRepository;
    @Autowired
    private ExamenParticipantRepository epRepo;
    public Formation createFormation(Formation formation) {
        return formationRepository.save(formation);
    }

    public List<Formation> getAllFormations() {
        return formationRepository.findAll();
    }

    public Optional<Formation> getFormationById(Long id) {
        return formationRepository.findById(id);
    }

    public void deleteFormation(Long id) {
        formationRepository.deleteById(id);
    }
    public Formation updateFormation(Long id, Formation updatedFormation) {
        return formationRepository.findById(id).map(formation -> {
            formation.setTitre(updatedFormation.getTitre());
            formation.setDescription(updatedFormation.getDescription());
            formation.setFormationT(updatedFormation.getFormationT());
            formation.setNiveau(updatedFormation.getNiveau());

            return formationRepository.save(formation);
        }).orElseThrow(() -> new RuntimeException("Formation avec ID " + id + " non trouvée"));
    }

    public List<Formation> getFormationsusers(Integer id) {
        User user = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/users/userById")
                        .build())
                .header("userId", id.toString())
                .retrieve()
                .bodyToMono(User.class)
                .block();

        return formationRepository.findAllByUserIds(user.getUserId());
    }
    @Autowired
    private WebClient webClient;

    public List<UserMoyenneResponse> getUsersWithMoyenne(Long formationId) {
        List<UserNoteDTO> results = epRepo.findUserMoyenneByFormationId(formationId);
        List<UserMoyenneResponse> response = new ArrayList<>();

        for (UserNoteDTO dto : results) {
            int id = dto.getUserId();
            User user = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/api/users/userById")
                            .build())
                    .header("userId", String.valueOf(id))
                    .retrieve()
                    .bodyToMono(User.class)
                    .block();
            if (user != null) {
                response.add(new UserMoyenneResponse(user, dto.getMoyenne()));
            }
        }
        return response;
    }
    public String assignUserToFormation(Integer userId, Long formationId) {
        User user = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/users/userById")
                        .build())
                .header("userId", userId.toString())
                .retrieve()
                .bodyToMono(User.class)
                .block();


        if (user == null) {
            return "Utilisateur introuvable dans le service utilisateur.";
        }
        Optional<Formation> formationOpt = formationRepository.findById(formationId);

        if (formationOpt.isPresent()) {

            Formation formation = formationOpt.get();
            if (!formation.getUserIds().contains(user.getUserId())) {
                formation.getUserIds().add(user.getUserId());
                formationRepository.save(formation);

                return "Utilisateur affecté à la formation avec succès.";
            } else {
                return "Utilisateur déjà inscrit à cette formation.";
            }
        }
        return "Utilisateur ou formation introuvable.";
    }
    public String assignUserToFormationrecommandation(Integer userId, Formation formation) {
        // Récupérer l'utilisateur via WebClient
        User user = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/users/userById")
                        .build())
                .header("userId", userId.toString())
                .retrieve()
                .bodyToMono(User.class)
                .block();

        if (user == null) {
            return "Utilisateur introuvable dans le service utilisateur.";
        }

        Optional<Formation> existingFormationOpt = formationRepository.findByTitre(formation.getTitre());
        Formation formationToSave;

        if (existingFormationOpt.isPresent()) {
            formationToSave = existingFormationOpt.get();
        } else {
            formationToSave = formationRepository.save(formation);
        }

        if (formationToSave.getUserIds() == null) {
            formationToSave.setUserIds(new ArrayList<>());
        }

        if (!formationToSave.getUserIds().contains(user.getUserId())) {
            formationToSave.getUserIds().add(user.getUserId());
            formationRepository.save(formationToSave);

               assignUserToFormation(userId, formationToSave.getId());

            return "Utilisateur affecté à la formation avec succès.";
        } else {
            return "Utilisateur déjà inscrit à cette formation.";
        }
    }

    public List<Formation> recommendFormationsAI(Integer userId) {
        User user = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/users/userById")
                        .build())
                .header("userId", userId.toString())
                .retrieve()
                .bodyToMono(User.class)
                .block();

        if (user == null) return Collections.emptyList();
        List<Formation> userFormations = formationRepository.findAllByUserIds(user.getUserId());


        String niveau = userFormations.isEmpty() ? "Beginner" : userFormations.get(0).getNiveau();

        WebClient aiClient = WebClient.builder()
                .baseUrl("http://localhost:5001")
                .build();
        List<String> titles = userFormations.stream()
                .map(Formation::getTitre)
                .collect(Collectors.toList());
        List<Map<String, Object>> recommended = aiClient.post()
                .uri("/recommend")
                .bodyValue(Map.of("titles", titles, "niveau", niveau))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();

        return recommended.stream().map(map -> {
            Formation f = new Formation();
            f.setId(Long.valueOf(map.get("id").toString()));
            f.setTitre(map.get("titre").toString());
            f.setDescription(map.get("description").toString());
            f.setFormationT(TypeFormation.valueOf(map.get("type").toString()));
            f.setNiveau(map.get("niveau").toString());
            return f;
        }).collect(Collectors.toList());
    }


}
