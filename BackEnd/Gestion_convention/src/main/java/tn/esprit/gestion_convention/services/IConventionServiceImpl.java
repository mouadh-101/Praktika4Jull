package tn.esprit.gestion_convention.services;

import com.itextpdf.text.*;
import com.itextpdf.text.Font;
import com.itextpdf.text.Image;
import com.itextpdf.text.pdf.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.gestion_convention.entities.Convention;
import tn.esprit.gestion_convention.entities.Terms;
import tn.esprit.gestion_convention.repositories.IConventionRepo;
import tn.esprit.gestion_convention.repositories.ITermsRepo;

import java.awt.*;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class IConventionServiceImpl implements IConventionService{
    @Autowired
    IConventionRepo conventionRepo;
    @Autowired
    ITermsRepo ItermsRepo;
    private final ITermsService ITermsService; // Injection du service
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
            Document document = new Document(PageSize.A4, 40, 40, 100, 70);
            PdfWriter writer = PdfWriter.getInstance(document, baos);

            // Ajout du header/footer personnalisé
            HeaderFooter event = new HeaderFooter();
            writer.setPageEvent(event);

            document.open();

            // Style amélioré
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, BaseColor.DARK_GRAY);
            Font sectionFont = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD, new BaseColor(0, 51, 153));
            Font contentFont = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.NORMAL, BaseColor.BLACK);

            // Cadre bleu autour du contenu
            PdfContentByte canvas = writer.getDirectContentUnder();
            canvas.setColorStroke(BaseColor.BLUE);
            canvas.rectangle(30, 30, document.getPageSize().getWidth() - 60, document.getPageSize().getHeight() - 60);
            canvas.stroke();

            // Entête avec logos
            Paragraph header = new Paragraph();
            header.setSpacingAfter(20f);

            // Logo gauche
            Image logoLeft = Image.getInstance("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIz35xRMeDZwRhvFLDuLK_-AG8SkBsDsx_bg&s");
            logoLeft.scaleToFit(80, 80);
            header.add(logoLeft);

            // Titre centré
            Paragraph title = new Paragraph("CONVENTION DE STAGE", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            header.add(title);

            // Logo droit
            Image logoRight = Image.getInstance("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIz35xRMeDZwRhvFLDuLK_-AG8SkBsDsx_bg&s");
            logoRight.scaleToFit(80, 80);
            logoRight.setAbsolutePosition(document.getPageSize().getWidth() - 100, document.getPageSize().getHeight() - 70);
            canvas.addImage(logoRight);

            document.add(header);

            // Section informations
            Paragraph infoSection = new Paragraph("Informations Générales", sectionFont);
            infoSection.setSpacingBefore(20f);
            infoSection.setSpacingAfter(15f);
            document.add(infoSection);

            // Métadonnées sous forme de tableau
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);

            addTableHeader(table, "Champ", "Valeur", sectionFont);
            addTableRow(table, "Numéro Convention", convention.getConId().toString(), contentFont);
            addTableRow(table, "Date création", new SimpleDateFormat("dd/MM/yyyy:HH:mm:ss").format(convention.getDateConv()), contentFont);
            addTableRow(table, "Statut", convention.getSigned() ? "Signée" : "Non signée", contentFont);


            document.add(table);

            // Section description
            Paragraph descSection = new Paragraph("Description de la Convention", sectionFont);
            descSection.setSpacingBefore(20f);
            document.add(descSection);

            Paragraph description = new Paragraph(convention.getDescription(), contentFont);
            description.setIndentationLeft(20);
            document.add(description);

            // Section termes
            Paragraph termsSection = new Paragraph("Clauses Contractuelles", sectionFont);
            termsSection.setSpacingBefore(20f);
            termsSection.setSpacingAfter(15f);
            document.add(termsSection);

            List<Terms> terms = convention.getTerms();
            for (int i = 0; i < terms.size(); i++) {
                Terms term = terms.get(i);

                Paragraph clause = new Paragraph();
                clause.setFont(contentFont);
                clause.add(new Chunk("Article " + (i+1) + " - ", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
                clause.add(new Chunk(term.getTitle() + "\n", sectionFont));
                clause.add(new Chunk(term.getDescription() + "\n\n", contentFont));

                document.add(clause);
            }

            document.close();
            return baos.toByteArray();
        } catch (DocumentException | IOException e) {
            throw new Exception("Erreur lors de la génération du PDF", e);
        }
    }

    // Méthodes utilitaires
    private void addTableHeader(PdfPTable table, String header1, String header2, Font font) {
        table.addCell(createCell(header1, font, BaseColor.LIGHT_GRAY));
        table.addCell(createCell(header2, font, BaseColor.LIGHT_GRAY));
    }

    private void addTableRow(PdfPTable table, String label, String value, Font font) {
        table.addCell(createCell(label, font, BaseColor.WHITE));
        table.addCell(createCell(value, font, BaseColor.WHITE));
    }

    private PdfPCell createCell(String text, Font font, BaseColor bgColor) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(bgColor);
        cell.setPadding(5);
        cell.setBorderColor(BaseColor.GRAY);
        return cell;
    }

    // Classe interne pour header/footer
    class HeaderFooter extends PdfPageEventHelper {
        public void onEndPage(PdfWriter writer, Document document) {
            PdfContentByte cb = writer.getDirectContent();

            // Header
            cb.setColorFill(BaseColor.DARK_GRAY);
            cb.rectangle(30, document.getPageSize().getHeight() - 50, document.getPageSize().getWidth() - 60, 2);
            cb.fill();

            // Footer
            ColumnText.showTextAligned(cb, Element.ALIGN_CENTER,
                    new Phrase("Page " + document.getPageNumber(), new Font(Font.FontFamily.HELVETICA, 10)),
                    (document.right() - document.left()) / 2 + document.leftMargin(),
                    document.bottom() - 20, 0);

            cb.rectangle(30, 50, document.getPageSize().getWidth() - 60, 2);
            cb.fill();
        }
    }
}
