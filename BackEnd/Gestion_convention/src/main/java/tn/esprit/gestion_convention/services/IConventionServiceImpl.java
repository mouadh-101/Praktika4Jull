package tn.esprit.gestion_convention.services;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.itextpdf.text.*;
import com.itextpdf.text.Font;
import com.itextpdf.text.Image;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.pdf.draw.DottedLineSeparator;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.gestion_convention.entities.Convention;
import tn.esprit.gestion_convention.entities.Terms;
import tn.esprit.gestion_convention.repositories.IConventionRepo;
import tn.esprit.gestion_convention.repositories.ITermsRepo;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.awt.*;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.IOException;
@Service
@AllArgsConstructor
public class IConventionServiceImpl implements IConventionService{
    @Autowired
    IConventionRepo conventionRepo;
    @Autowired
    ITermsRepo ItermsRepo;
    private final ITermsService ITermsService; // Injection du service
    @Autowired
    private final JavaMailSender mailSender;
    @Override
    public List<Convention> getAllConventions() {
        return conventionRepo.findAll();
    }


    @Override
    public Convention getConventionById(Integer id) {
        return conventionRepo.findById(id).orElse(null);
    }

    @Override
    public Convention saveConvention(Convention convention) {
        convention.setDateConv(new Date()); // Définir la date actuelle

        // Vérifier si la convention contient des termes et les associer
        if (convention.getTerms() != null && !convention.getTerms().isEmpty()) {
            convention.getTerms().forEach(term -> term.setConvention(convention));
        }

        return conventionRepo.save(convention); // Sauvegarde en cascade (grâce à @OneToMany)
    }


    @Override
    public void deleteConvention(Integer id) {
        conventionRepo.deleteById(id);
    }


    @Override
    @Transactional
    public Convention updateConvention(Integer id, Convention convention) {
        return conventionRepo.findById(id).map(existing -> {
            // Mise à jour des champs simples
            existing.setDateConv(new Date()); // Définit la date actuelle au format java.util.Date
            existing.setDescription(convention.getDescription());
            existing.setSigned(convention.getSigned());
            existing.setInternshipId(convention.getInternshipId());

            // Gestion des termes
            List<Terms> incomingTerms = convention.getTerms();
            List<Terms> existingTerms = existing.getTerms();

            // Suppression des termes non présents
            existingTerms.removeIf(existingTerm ->
                    incomingTerms.stream().noneMatch(t -> t.getTermId().equals(existingTerm.getTermId()))
            );

            // Mise à jour/ajout des termes
            incomingTerms.forEach(term -> {
                if(term.getTermId() != null) {
                    // Appel correct au service avec les deux paramètres
                    Terms updatedTerm = ITermsService.updateTerms(term.getTermId(), term);
                    existing.getTerms().add(updatedTerm);
                } else {
                    term.setConvention(existing);
                    existing.getTerms().add(term);
                }
            });

            return conventionRepo.save(existing);
        }).orElseThrow(() -> new RuntimeException("Convention introuvable avec l'ID: " + id));
    }

    @Override
    public Convention affecterTerm(Integer id, Integer idTerm) {
        Convention convention = conventionRepo.findById(id).orElse(null);
        Terms terms = ItermsRepo.findById(idTerm).orElse(null);
        convention.getTerms().add(terms);
        return conventionRepo.save(convention);
    }

    // Méthode de filtrage des conventions par date

    @Override
    public List<Convention> filterConventionsByDate(Date startDate, Date endDate) {
        // Définir la Specification pour filtrer par date
        Specification<Convention> dateFilterSpec = (Root<Convention> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            return criteriaBuilder.between(root.get("DateConv"), startDate, endDate);
        };

        // Utiliser findAll avec la Specification
        return conventionRepo.findAll(dateFilterSpec);
    }
    @Override
    public Long countConventionsByMonthAndYear(int month, int year) {
        // Appeler la méthode du repository pour obtenir le nombre de conventions par mois et année
        return conventionRepo.countConventionsByMonthAndYear(month, year);
    }

    @Override
    public List<Convention> intelligentSearch(String keyword, Boolean signedStatus) {
        if (keyword == null) keyword = "";
        return conventionRepo.intelligentSearch(keyword.trim(), signedStatus);
    }

    @Override
    public byte[] generatePdf(Integer id) throws Exception {
        Convention convention = conventionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Convention non trouvée"));

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 80, 80); // Marges ajustées
            PdfWriter writer = PdfWriter.getInstance(document, baos);

            // Ajout du header/footer personnalisé et gestion des cadres par page
            HeaderFooter event = new HeaderFooter();
            writer.setPageEvent(event);

            document.open();

            // Styles professionnels
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 20, Font.BOLD, new BaseColor(0, 51, 102)); // Bleu foncé
            Font sectionFont = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD, new BaseColor(33, 37, 41)); // Gris foncé
            Font subTitleFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLDITALIC, BaseColor.BLACK);
            Font contentFont = new Font(Font.FontFamily.TIMES_ROMAN, 11, Font.NORMAL, BaseColor.BLACK);

            // Cadre bleu pour la première page
            PdfContentByte canvas = writer.getDirectContentUnder();
            canvas.setColorStroke(new BaseColor(0, 102, 204)); // Bleu moyen
            canvas.setLineWidth(1f);
            canvas.rectangle(30, 30, document.getPageSize().getWidth() - 60, document.getPageSize().getHeight() - 60);
            canvas.stroke();

            // En-tête avec logos repositionnés
            PdfPTable headerTable = new PdfPTable(3);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{1, 2, 1});
            headerTable.setSpacingAfter(20f);

            // Logo gauche
            Image logoLeft = Image.getInstance("https://raw.githubusercontent.com/mouadh-101/Praktika/refs/heads/main/FrontEnd/src/assets/img/logo.png");
            logoLeft.scaleToFit(70, 70);
            PdfPCell logoLeftCell = new PdfPCell(logoLeft, true);
            logoLeftCell.setBorder(Rectangle.NO_BORDER);
            logoLeftCell.setVerticalAlignment(Element.ALIGN_TOP);
            headerTable.addCell(logoLeftCell);

            // Titre centré
            Paragraph title = new Paragraph("CONVENTION DE STAGE", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            PdfPCell titleCell = new PdfPCell(title);
            titleCell.setBorder(Rectangle.NO_BORDER);
            titleCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            headerTable.addCell(titleCell);

            // Logo droit
            Image logoRight = Image.getInstance("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIz35xRMeDZwRhvFLDuLK_-AG8SkBsDsx_bg&s");
            logoRight.scaleToFit(70, 70);
            PdfPCell logoRightCell = new PdfPCell(logoRight, true);
            logoRightCell.setBorder(Rectangle.NO_BORDER);
            logoRightCell.setVerticalAlignment(Element.ALIGN_TOP);
            logoRightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            headerTable.addCell(logoRightCell);

            document.add(headerTable);

            // Ligne séparatrice après l’en-tête
            Paragraph separator = new Paragraph(" ");
            separator.setSpacingBefore(10f);
            document.add(new Chunk(new DottedLineSeparator()));

            // Section Informations Générales
            Paragraph infoSection = new Paragraph("Informations Générales", sectionFont);
            infoSection.setSpacingBefore(20f);
            infoSection.setSpacingAfter(10f);
            document.add(infoSection);

            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setWidths(new float[]{1, 2});

            addTableHeader(infoTable, "Champ", "Valeur", subTitleFont);
            addTableRow(infoTable, "Numéro de la Convention", convention.getConId().toString(), contentFont);
            addTableRow(infoTable, "Date de Création", new SimpleDateFormat("dd/MM/yyyy HH:mm:ss").format(convention.getDateConv()), contentFont);
            addTableRow(infoTable, "Statut", convention.getSigned() ? "Signée" : "Non signée", contentFont);
            document.add(infoTable);

            // Section Description
            Paragraph descSection = new Paragraph("Description de la Convention", sectionFont);
            descSection.setSpacingBefore(20f);
            descSection.setSpacingAfter(10f);
            document.add(descSection);

            Paragraph description = new Paragraph(convention.getDescription(), contentFont);
            description.setAlignment(Element.ALIGN_JUSTIFIED);
            description.setIndentationLeft(10);
            description.setSpacingAfter(15f);
            document.add(description);

            // Section Termes
            Paragraph termsSection = new Paragraph("Clauses Contractuelles", sectionFont);
            termsSection.setSpacingBefore(20f);
            termsSection.setSpacingAfter(10f);
            document.add(termsSection);

            List<Terms> terms = convention.getTerms();
            for (int i = 0; i < terms.size(); i++) {
                Terms term = terms.get(i);
                Paragraph clauseTitle = new Paragraph("Article " + (i + 1) + " : " + term.getTitle(), subTitleFont);
                clauseTitle.setSpacingBefore(10f);
                document.add(clauseTitle);

                Paragraph clauseDesc = new Paragraph(term.getDescription(), contentFont);
                clauseDesc.setIndentationLeft(20);
                clauseDesc.setSpacingAfter(10f);
                clauseDesc.setAlignment(Element.ALIGN_JUSTIFIED);
                document.add(clauseDesc);
            }

            // Forcer une nouvelle page pour les signatures
            document.newPage();

            // Cadre bleu pour la deuxième page
            canvas.setColorStroke(new BaseColor(0, 102, 204)); // Bleu moyen
            canvas.setLineWidth(1f);
            canvas.rectangle(30, 30, document.getPageSize().getWidth() - 60, document.getPageSize().getHeight() - 60);
            canvas.stroke();

            // Section Signatures (sur la deuxième page)
            Paragraph signatureSection = new Paragraph("Signatures", sectionFont);
            signatureSection.setSpacingBefore(40f); // Espace au-dessus pour centrer verticalement
            signatureSection.setSpacingAfter(15f);
            signatureSection.setAlignment(Element.ALIGN_CENTER);
            document.add(signatureSection);

            PdfPTable signatureTable = new PdfPTable(2);
            signatureTable.setWidthPercentage(100);
            signatureTable.setWidths(new float[]{1, 1});
            signatureTable.setSpacingBefore(20f);

            // Signature de l'étudiant (placeholder)
            PdfPCell studentCell = new PdfPCell(new Phrase("Signature de l'étudiant : ____________________", contentFont));
            studentCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            studentCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            studentCell.setPadding(20);
            studentCell.setBorder(Rectangle.NO_BORDER);
            signatureTable.addCell(studentCell);

            // Signature de l'entreprise
            if (convention.getSigned() && convention.getEncryptedSignature() != null && convention.getEncryptedSignature().startsWith("data:image")) {
                try {
                    String base64Image = convention.getEncryptedSignature().split(",")[1];
                    byte[] imageBytes = Base64.getDecoder().decode(base64Image);
                    Image signatureImage = Image.getInstance(imageBytes);
                    signatureImage.scaleToFit(150, 75);

                    PdfPCell signatureCell = new PdfPCell(signatureImage, true);
                    signatureCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    signatureCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                    signatureCell.setPadding(20);
                    signatureCell.setBorder(Rectangle.NO_BORDER);
                    signatureTable.addCell(signatureCell);

                    // Date de signature en dessous
                    Paragraph signatureDate = new Paragraph("Signée le " + new SimpleDateFormat("dd/MM/yyyy HH:mm:ss").format(convention.getDateConv()), contentFont);
                    signatureDate.setAlignment(Element.ALIGN_CENTER);
                    signatureDate.setSpacingBefore(10f);
                    document.add(signatureDate);
                } catch (Exception e) {
                    PdfPCell noSignatureCell = new PdfPCell(new Phrase("Signature de l'entreprise : ____________________", contentFont));
                    noSignatureCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    noSignatureCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                    noSignatureCell.setPadding(20);
                    noSignatureCell.setBorder(Rectangle.NO_BORDER);
                    signatureTable.addCell(noSignatureCell);
                }
            } else {
                PdfPCell noSignatureCell = new PdfPCell(new Phrase("Signature de l'entreprise : ____________________", contentFont));
                noSignatureCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                noSignatureCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                noSignatureCell.setPadding(20);
                noSignatureCell.setBorder(Rectangle.NO_BORDER);
                signatureTable.addCell(noSignatureCell);
            }

            document.add(signatureTable);

            document.close();
            return baos.toByteArray();
        } catch (DocumentException | IOException e) {
            throw new Exception("Erreur lors de la génération du PDF", e);
        }
    }

    // Méthodes utilitaires
    private void addTableHeader(PdfPTable table, String header1, String header2, Font font) {
        PdfPCell cell1 = new PdfPCell(new Phrase(header1, font));
        cell1.setBackgroundColor(new BaseColor(230, 230, 250)); // Lavande clair
        cell1.setPadding(8);
        cell1.setBorderColor(BaseColor.GRAY);
        table.addCell(cell1);

        PdfPCell cell2 = new PdfPCell(new Phrase(header2, font));
        cell2.setBackgroundColor(new BaseColor(230, 230, 250));
        cell2.setPadding(8);
        cell2.setBorderColor(BaseColor.GRAY);
        table.addCell(cell2);
    }

    private void addTableRow(PdfPTable table, String label, String value, Font font) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, font));
        labelCell.setPadding(6);
        labelCell.setBorderColor(BaseColor.GRAY);
        table.addCell(labelCell);

        PdfPCell valueCell = new PdfPCell(new Phrase(value, font));
        valueCell.setPadding(6);
        valueCell.setBorderColor(BaseColor.GRAY);
        table.addCell(valueCell);
    }

    // Classe interne pour header/footer
    class HeaderFooter extends PdfPageEventHelper {
        public void onEndPage(PdfWriter writer, Document document) {
            PdfContentByte cb = writer.getDirectContent();
            cb.setColorFill(new BaseColor(33, 37, 41)); // Gris foncé
            cb.setLineWidth(0.5f);

            // Ligne header
            cb.moveTo(36, document.getPageSize().getHeight() - 60);
            cb.lineTo(document.getPageSize().getWidth() - 36, document.getPageSize().getHeight() - 60);
            cb.stroke();

            // Footer avec numéro de page
            ColumnText.showTextAligned(cb, Element.ALIGN_CENTER,
                    new Phrase("Page " + document.getPageNumber(), new Font(Font.FontFamily.HELVETICA, 9, Font.NORMAL, BaseColor.GRAY)),
                    (document.right() - document.left()) / 2 + document.leftMargin(),
                    document.bottom() - 20, 0);

            // Ligne footer
            cb.moveTo(36, 60);
            cb.lineTo(document.getPageSize().getWidth() - 36, 60);
            cb.stroke();
        }
    }

    @Override
    @Transactional
    public Convention signConvention(Integer id, String signatureData) {
        System.out.println("Signature dans le service : " + signatureData);
        return conventionRepo.findById(id).map(convention -> {
            if (convention.getSigned()) {
                throw new RuntimeException("La convention est déjà signée");
            }
            try {
                String secretKey = "MySecretKey12345";
                SecretKeySpec key = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "AES");
                Cipher cipher = Cipher.getInstance("AES");
                cipher.init(Cipher.ENCRYPT_MODE, key);
                byte[] encryptedBytes = cipher.doFinal(signatureData.getBytes(StandardCharsets.UTF_8));
                String encryptedSignature = Base64.getEncoder().encodeToString(encryptedBytes);

                convention.setEncryptedSignature(encryptedSignature); // Stocke la version cryptée
                convention.setSigned(true);

                Convention savedConvention = conventionRepo.save(convention);
                // Ajoute la signature non cryptée comme champ temporaire dans la réponse
                savedConvention.setEncryptedSignature(signatureData); // Pour l’affichage immédiat
                return savedConvention;
            } catch (Exception e) {
                throw new RuntimeException("Erreur lors du cryptage de la signature", e);
            }
        }).orElseThrow(() -> new RuntimeException("Convention introuvable avec l'ID: " + id));
    }

    @Override
    public void sendEmailWithAttachment(String to, String from, String subject, MultipartFile file) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setFrom(from);
            helper.setSubject(subject);
            helper.setText("Veuillez trouver en pièce jointe le document.");

            // Attacher le fichier
            helper.addAttachment(file.getOriginalFilename(), new ByteArrayResource(file.getBytes()));

            mailSender.send(message);
        } catch (MessagingException | IOException e) {
            e.printStackTrace(); // Vous pouvez gérer l'exception comme vous le souhaitez
        }
    }

    public byte[] generateQRCode(Convention convention) throws Exception {
        // Crée un contenu lisible à afficher après scan
        StringBuilder content = new StringBuilder();
        content.append("📄 Convention Details\n");
        content.append("📅 Date: ").append(convention.getDateConv()).append("\n");
        content.append("📝 Description: ").append(convention.getDescription()).append("\n");
        content.append("✅ Signed: ").append(convention.getSigned() ? "Yes" : "No").append("\n");

        content.append("📜 Terms:\n");
        for (Terms t : convention.getTerms()) {
            content.append(" - ").append(t.getTitle()).append(": ").append(t.getDescription()).append("\n");
        }

        BitMatrix matrix = new MultiFormatWriter().encode(content.toString(), BarcodeFormat.QR_CODE, 250, 250);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(matrix, "PNG", out);
        return out.toByteArray();
    }
    }
