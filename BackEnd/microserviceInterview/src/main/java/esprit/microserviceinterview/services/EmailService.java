package esprit.microserviceinterview.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    // Méthode pour envoyer un e-mail de rappel pour l'entretien
    public void sendInterviewReminder(String toEmail, String interviewDetails) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Reminder: Upcoming Interview");
        message.setText("Dear Candidate,\n\nThis is a reminder for your upcoming interview:\n" + interviewDetails + "\n\nBest Regards,\nYour Company");
        mailSender.send(message);
    }
}
