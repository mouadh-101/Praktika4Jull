package tn.esprit.intershipproccess.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.intershipproccess.client.StudentClient;
import tn.esprit.intershipproccess.entity.Internship;
import tn.esprit.intershipproccess.entity.Requirement;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class MatchmakingService {
    private final StudentClient client;

    // Calcul du score de correspondance
    public double calculateMatchingScore(String userId, Internship internship) {
        // Récupérer les compétences de l'étudiant
        List<String> studentSkills = client.getAllSkillsNames(userId);

        // Si l'étudiant n'a aucune compétence, retourner 0
        if (studentSkills == null || studentSkills.isEmpty()) {
            return 0.0;
        }

        // Récupérer les exigences du stage
        List<Requirement> internshipRequirements = internship.getRequirements();

        // Calcul du score basé sur les compétences correspondantes
        return internshipRequirements.stream()
                .filter(req -> studentSkills.contains(req.getName()))
                .count();
    }

    // Retourner les stages pertinents, ou tous les stages si l'étudiant n'a pas de compétences
    public List<Internship> matchInternships(String userId, List<Internship> internships) {
        List<String> studentSkills = client.getAllSkillsNames(userId);

        // ✅ Si l'étudiant n'a aucune compétence, retourner tous les stages
        if (studentSkills == null || studentSkills.isEmpty()) {
            return internships;
        }

        // ✅ Sinon, filtrer les stages pertinents
        return internships.stream()
                .map(internship -> Map.entry(internship, calculateMatchingScore(userId, internship)))
                .filter(entry -> entry.getValue() > 0) // ❌ Exclure les stages avec 0 correspondance
                .sorted((e1, e2) -> Double.compare(e2.getValue(), e1.getValue())) // Tri décroissant par score
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }
}
