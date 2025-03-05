package tn.esprit.intershipproccess.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.intershipproccess.client.StudentClient;
import tn.esprit.intershipproccess.client.UserClient;
import tn.esprit.intershipproccess.entity.Internship;
import tn.esprit.intershipproccess.entity.Requirement;

import java.util.List;

@RequiredArgsConstructor
@Service
public class MatchmakingService {
    private final StudentClient client;
    // Calcul du score de correspondance
    public double calculateMatchingScore(String userId, Internship internship) {
        double score = 0.0;

        // Récupérer les compétences de l'étudiant et les exigences du stage
        List<String> studentSkills = client.getAllSkillsNames(userId);
        List<Requirement> internshipRequirements = internship.getRequirements();

        // Pour chaque exigence de stage, vérifier si l'étudiant possède la compétence
        for (Requirement requiredSkill : internshipRequirements) {
            for (String studentSkill : studentSkills) {
                if (requiredSkill.getName().equals(studentSkill)) {
                    score += 1.0;
                }
            }
        }

        return score;
    }

    // Retourner le stage le mieux adapté
    public Internship matchInternship(String userId, List<Internship> internships) {
        double highestScore = 0.0;
        Internship bestMatch = null;

        // Calculer le score pour chaque stage
        for (Internship internship : internships) {
            double score = calculateMatchingScore(userId, internship);
            if (score > highestScore) {
                highestScore = score;
                bestMatch = internship;
            }
        }

        return bestMatch;
    }
}
