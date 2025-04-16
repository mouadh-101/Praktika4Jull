package esprit.microservice1.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    public void envoyerEmail(String to, String sujet, String message) {
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(to);
        email.setSubject(sujet);
        email.setText(message);

        mailSender.send(email);
    }
}
