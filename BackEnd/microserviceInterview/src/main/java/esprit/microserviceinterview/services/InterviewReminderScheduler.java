package esprit.microserviceinterview.services;

import esprit.microserviceinterview.Client.Dto.UserDto;
import esprit.microserviceinterview.Client.UserClient;
import esprit.microserviceinterview.entities.Interview;
import esprit.microserviceinterview.repositories.InterviewRepo;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Service
public class InterviewReminderScheduler {

    @Autowired
    private EmailService emailService;

    @Autowired
    private InterviewRepo interviewRepository;
    @Autowired
    private UserClient userClient;

    // Envoie les rappels 24 heures avant l'entretien
    //@Scheduled(cron = "0 0 9 * * ?")  // Exécute tous les jours à 9h00
    @Scheduled(cron = "*/5 * * * * ?")
    public void sendInterviewReminders() {
        // Récupérer toutes les interviews programmées
        List<Interview> interviews = interviewRepository.findAll();

        // Parcours chaque entretien pour vérifier si c'est l'heure d'envoyer un rappel
        for (Interview interview : interviews) {
            // Convertir Date en LocalDateTime
            LocalDateTime interviewTime = interview.getDateInterview().toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime();

            // Récupérer la date actuelle (au format LocalDate pour comparer sans tenir compte de l'heure)
            LocalDateTime now = LocalDateTime.now();
            LocalDate currentDate = now.toLocalDate();
            LocalDate interviewDate = interviewTime.toLocalDate();

            // Si l'entretien est le même jour
            if (currentDate.isEqual(interviewDate)) {
                // Calculer le rappel 24 heures avant l'entretien
                LocalDateTime reminderTime = interviewTime.minus(1, ChronoUnit.DAYS);

                // Si la date et l'heure actuelle sont après la date du rappel et avant l'entretien, envoie un rappel
                if (now.isAfter(reminderTime) && now.isBefore(interviewTime)) {
                    // Récupérer les informations des utilisateurs (étudiant et entreprise)
                    UserDto student = userClient.getUserByUserId(interview.getStudentId());
                    UserDto company = userClient.getUserByUserId(interview.getCompanyId());

                    // Préparer les détails de l'entretien
                    String interviewDetails = "Date: " + interview.getDateInterview() + "\nInterview Link: " + interview.getInterviewLink();

                    // Envoi du rappel par e-mail au candidat
                    emailService.sendInterviewReminder(student.getEmail(), interviewDetails);

                    // (Optionnel) Envoi d'un e-mail de rappel à l'entreprise (si nécessaire)
                    // emailService.sendInterviewReminder(company.getEmail(), interviewDetails);
                }
            }
        }
    }
}
