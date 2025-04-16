package tn.esprit.microservicedocument.service.impl;

import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import tn.esprit.microservicedocument.entities.Document;
import tn.esprit.microservicedocument.entities.Duree;
import tn.esprit.microservicedocument.entities.StatusDoc;
import tn.esprit.microservicedocument.repository.IDocumentRepository;
import tn.esprit.microservicedocument.service.IDocumentService;
import com.itextpdf.text.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class DocumentServiceImpl implements IDocumentService {
    @Autowired
    IDocumentRepository documentRepository;

    @Autowired
    EmailService emailService;
    @Override
    public Document ajouterDocument(Document document) {
        /*String email="faresfelhi45@gmail.com";
        String subject= "Ajout avec succès";
        String body = "Votre stage a été ajouté avec succès à " + document.getSociete() + " du " + document.getDateDebut() + " au " + document.getDateFin() + ".";

        emailService.sendEmail(
                email,
                subject,
                body
        );*/
        return documentRepository.save(document);

    }

    @Override
    public   void supprimerDocument(Long id){
        documentRepository.deleteById(id);
    }

    @Override
    public Document updateDocument(Document document) {
        if (document.getDocid() == null || !documentRepository.existsById(document.getDocid())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found with id " + document.getDocid());
        }
        String email="faresfelhi45@gmail.com";
        String subject= "Modifier avec succès";
        String body="Votre stage a été Modifié avec succès à " + document.getSociete() + " du " + document.getDateDebut() + " au " + document.getDateFin() + ".";

        emailService.sendEmail(
                email,
                subject,
                body
        );
        // Mettez à jour les champs du document ici si nécessaire
        return documentRepository.save(document);
    }
    @Override
    public Document chercherDodcument(Long id) {
        return documentRepository.findById(id).orElse(null);
    }

    public List<Document> afficherDocument() {
         return documentRepository.findAll();
     }

    @Override
    public void validerDocument(Long id) {
        documentRepository.findById(id).ifPresent(document -> {
            document.validerStatus();

            documentRepository.save(document);
            String email="faresfelhi45@gmail.com";
            String subject= "Validé avec succès";
            String body="Votre stage a été validé  à " + document.getSociete() + " du " + document.getDateDebut() + " au " + document.getDateFin() + ".";

            emailService.sendEmail(
                    email,
                    subject,
                    body
            );
        });

    }
    @Override
    public void RefuserDocument(Long id) {
        documentRepository.findById(id).ifPresent(document -> {
            document.refuserStatus();

            documentRepository.save(document);
            String email="faresfelhi45@gmail.com";
            String subject= "Refus de stage";
            String body = "Votre stage a été refusé à " + document.getSociete() + " du " + document.getDateDebut() + " au " + document.getDateFin() + ". Veuillez consulter le département de stage.";

            emailService.sendEmail(
                    email,
                    subject,
                    body
            );
        });


    }
    public String getCurrentDate() {
        LocalDate date = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy");
        return  date.format(formatter);
    }
    @Override
    public byte[] DemandeDeStage(Document documents) throws DocumentException, IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        com.itextpdf.text.Document pdfDocument = new com.itextpdf.text.Document();
        PdfWriter.getInstance(pdfDocument, byteArrayOutputStream);
        pdfDocument.open();

        // Ajoutez le contenu au document PDF
        pdfDocument.add(new Paragraph("\n"));
        pdfDocument.add(new Paragraph("\n"));

        Paragraph date = new Paragraph("Tunis, le " + getCurrentDate());
        date.setAlignment(Paragraph.ALIGN_RIGHT);
        pdfDocument.add(date);
        pdfDocument.add(new Paragraph("\n"));
        pdfDocument.add(new Paragraph("\n"));
        pdfDocument.add(new Paragraph("\n"));
        pdfDocument.add(new Paragraph("\n"));

        Font fontBold = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        Paragraph titre = new Paragraph("À l'aimable attention de la Direction Générale", fontBold);
        titre.setAlignment(Paragraph.ALIGN_CENTER);
        pdfDocument.add(titre);
        pdfDocument.add(new Paragraph("\n"));
        pdfDocument.add(new Paragraph("\n"));
        pdfDocument.add(new Paragraph("\n"));
        pdfDocument.add(new Paragraph("\n"));

        Paragraph objet = new Paragraph("Objet : Demande de Stage Obligatoire", fontBold);
        pdfDocument.add(objet);

        Paragraph intro = new Paragraph("Madame, Monsieur,");
        pdfDocument.add(intro);
        pdfDocument.add(new Paragraph("\n"));
        pdfDocument.add(new Paragraph("\n"));
        pdfDocument.add(new Paragraph("\n"));

        Paragraph body1 = new Paragraph("L'École Supérieure Privée d'Ingénierie et de Technologies, Esprit, est un établissement d'enseignement supérieur privé ayant pour objectif principal la formation d'ingénieurs dans les domaines des technologies de l'information et de la communication, ainsi que de l'électromécanique et du génie civil.");
        pdfDocument.add(body1);
        pdfDocument.add(new Paragraph("\n"));

        Paragraph body2 = new Paragraph("Notre objectif consiste à former des ingénieurs opérationnels dès leur sortie d'école ; c'est dans ce but que nous encourageons nos élèves à mettre en pratique le savoir qu'ils ont acquis au cours de leur cursus universitaire.");
        pdfDocument.add(body2);
        pdfDocument.add(new Paragraph("\n"));

        Paragraph body3 = new Paragraph("C'est également dans le but de les amener à s'intégrer dans l'environnement de l'entreprise que nous vous demandons de bien vouloir accepter :");
        pdfDocument.add(body3);
        pdfDocument.add(new Paragraph("\n"));

        Paragraph student = new Paragraph("L'étudiant(e) :  Fares Felhi " , fontBold);
        student.setAlignment(Paragraph.ALIGN_CENTER);
        pdfDocument.add(student);
        pdfDocument.add(new Paragraph("\n"));

        Paragraph conclusion = new Paragraph("pour effectuer un stage obligatoire au sein de votre honorable société.\n\nEn vous remerciant pour votre précieux soutien, nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.");
        pdfDocument.add(conclusion);
        pdfDocument.add(new Paragraph("\n"));

        String signatureImagePath = "classpath:/static/signature.jpg";
        Image signatureImage = Image.getInstance(signatureImagePath);
        signatureImage.scaleAbsolute(200, 100);
        signatureImage.setAlignment(Paragraph.ALIGN_RIGHT);
        pdfDocument.add(signatureImage);

        pdfDocument.close();
        return byteArrayOutputStream.toByteArray();
    }
    @Override
    public byte[] LettreAffectation(Document documents) throws DocumentException, IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        com.itextpdf.text.Document document = new com.itextpdf.text.Document();
        PdfWriter.getInstance(document, byteArrayOutputStream);
        document.open();

        document.add(new Paragraph("\n"));
        document.add(new Paragraph("\n"));

        Paragraph date = new Paragraph("Tunis, le " + getCurrentDate());
        date.setAlignment(Paragraph.ALIGN_RIGHT);
        document.add(date);
        document.add(new Paragraph("\n"));
        document.add(new Paragraph("\n"));
        Font fontBold = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        Paragraph Titre = new Paragraph("Lettre d'affectation ",fontBold );
        Titre.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(Titre);
        document.add(new Paragraph("\n"));
        document.add(new Paragraph("\n"));
        document.add(new Paragraph("\n"));
        document.add(new Paragraph("\n"));
        Paragraph objet = new Paragraph("Suite à l'accord de la société:" +documents.getSociete(),fontBold);
        document.add(objet);
        document.add(new Paragraph("\n"));
        document.add(new Paragraph("\n"));
        document.add(new Paragraph("\n"));
        Paragraph student = new Paragraph("L'étudiant(e) :Fares Felhi",fontBold );
        student.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(student);
        document.add(new Paragraph("\n"));
        Paragraph body = new Paragraph("est affectué(e) à" +documents.getSociete() +"pour effectuer un stage obligatoire , et ce du" +documents.getDateDebut()+" au"+documents.getDateFin());
        document.add(body);
        document.add(new Paragraph("\n"));
        Paragraph conclusion = new Paragraph("Par ailleurs, il/elle est assuré(e) auprès de GAT Assurances par le contrat N 201209100016. ");
        document.add(conclusion);
        document.add(new Paragraph("\n"));
        String signatureImagePath = "classpath:/static/signature.jpg";
        Image signatureImage = Image.getInstance(signatureImagePath);
        signatureImage.scaleAbsolute(200, 100);
        signatureImage.setAlignment(Paragraph.ALIGN_RIGHT);
        document.add(signatureImage);
        document.close();
        return byteArrayOutputStream.toByteArray();
    }
    @Override
    public List<Document> getDocumentByDuree(Duree Duree) {
        return documentRepository.findDocumentsByDuree(Duree);
    }
    @Override
    public List<Document> getDocumentByStatusDoc(StatusDoc StatusDoc) {
        return documentRepository.findDocumentsByStatusDoc(StatusDoc );
    }

}
