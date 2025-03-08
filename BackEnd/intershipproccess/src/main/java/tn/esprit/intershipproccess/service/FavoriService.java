package tn.esprit.intershipproccess.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import tn.esprit.intershipproccess.client.UserClient;
import tn.esprit.intershipproccess.dto.NotificationMessage;
import tn.esprit.intershipproccess.entity.Company;
import tn.esprit.intershipproccess.entity.Favoris;
import tn.esprit.intershipproccess.entity.Internship;
import tn.esprit.intershipproccess.repository.FavoriRepository;
import tn.esprit.intershipproccess.repository.InternshipRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FavoriService {

    private final FavoriRepository favoriRepository;

    private final InternshipRepository internshipRepository;

    private final NotificationService notificationService;
    private static final Logger logger = LoggerFactory.getLogger(FavoriService.class);

    private final UserClient client;
    @Autowired
    private EmailService emailService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;


    public Favoris addFavoris(Favoris favoris,int idInternship,String userId){
        Internship internship = internshipRepository.findById(idInternship).orElse(null);
        favoris.setInternship(internship);
        favoris.setUserId(userId);
        return favoriRepository.save(favoris);
    }
    public boolean removeFavori(int idInternship, String userId) {
        Optional<Favoris> favoris = favoriRepository.findByUserIdAndInternshipId(userId, idInternship);
        logger.info(userId);
        if (favoris.isPresent()) {
            favoriRepository.delete(favoris.get());
            return true;
        }
        return false;
    }
    public boolean checkFavori(int idInternship, String userId) {
        Optional<Favoris> favoris = favoriRepository.findByUserIdAndInternshipId(userId, idInternship);
        return favoris.isPresent();  // Retourne true si le favori existe, sinon false
    }

    public List<Internship> findInternshipsByUserId(String userId) {
        // Récupère tous les favoris de l'utilisateur
        List<Favoris> favoris = favoriRepository.findAllByUserId(userId);

        // Récupère les internships associés à ces favoris
        List<Internship> internships = new ArrayList<>();
        for (Favoris favori : favoris) {
            Internship internship = internshipRepository.findById(favori.getInternship().getId()).orElse(null);
            if (internship != null) {
                internships.add(internship);
            }
        }
        return internships;
    }


    public void checkApplicationDeadlineAndNotify(String userId) {
        List<Favoris> favoris = favoriRepository.findAllByUserId(userId);
        LocalDate today = LocalDate.now();
        for (Favoris favori : favoris) {
            if (favori.getInternship().getApplicationDeadline().equals(today)) {
                String title = favori.getInternship().getTitre();
                String message = "Le délai de candidature pour le stage <strong>" + title + "</strong> est <span style='color: red; font-weight: bold;'>aujourd'hui</span>!";

                // Notification interne
                notificationService.sendNotification(userId, message);

                // Récupération de l'email de l'utilisateur
                String userEmail = client.getUserEmail(userId);

                // Envoi de l'email
                if (userEmail != null) {
                    String emailContent = "<div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>"
                            + "<h2 style='color: #0056b3;'>Internship Application Reminder</h2>"
                            + "<p>Hello,</p>"
                            + "<p>🚀 <strong>Be an early applicant!</strong> The application deadline for the <strong>" + title + "</strong> internship is <span style='color: red; font-weight: bold;'>today</span>.</p>"
                            + "<p>Don't miss this opportunity to kick-start your career.</p>"
                            + "<br>"
                            + "<p>🌍 <strong>Find your next opportunity with us!</strong> Our platform connects talented individuals like you with top internships worldwide.</p>"
                            + "<br>"
                            + "<a href='http://localhost:4200/internships' style='background-color: #0056b3; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;'>Apply Now</a>"
                            + "<br><br>"
                            + "<p>Best regards,</p>"
                            + "<p><strong>Your Internship Team</strong></p>"
                            + "</div>";

                    emailService.sendEmail(userEmail, "Internship Application Reminder", emailContent, true);
                }


                // Notification WebSockets
                messagingTemplate.convertAndSend("/topic/notifications", new NotificationMessage(message));
            }
        }
    }




      @Scheduled(cron = "*/10 * * * * *")
    @Scheduled(cron = "0 0 12 * * ?")
    public void checkApplicationDeadlineAndNotifyForAllUsers() {
        logger.info("Exécution de la tâche planifiée : vérification des deadlines de stages.");
        var allUserIds = client.findALLUsersId();
        for (String userId : allUserIds) {
            checkApplicationDeadlineAndNotify(userId);
        }
    }


}
