package tn.esprit.gestion_convention.services;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import tn.esprit.gestion_convention.entities.Convention;
import tn.esprit.gestion_convention.entities.Terms;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class PDFGenerationService {

    public byte[] generatePDF(Convention convention) throws DocumentException, IOException {
        // Création d'un document PDF
        Document document = new Document();
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        // Créer un écrivain PDF et associer le flux de sortie
        PdfWriter.getInstance(document, byteArrayOutputStream);
        document.open();

        // Ajouter le titre de la convention
        document.add(new Paragraph("Convention PDF"));
        document.add(new Paragraph("Date de la convention : " + convention.getDateConv().toString()));
        document.add(new Paragraph("Description : " + convention.getDescription()));
        document.add(new Paragraph("Internship ID : " + convention.getInternshipId()));
        document.add(new Paragraph("Signed : " + (convention.getSigned() ? "Oui" : "Non")));
        document.add(new Paragraph("\n\n"));

        // Ajouter les termes associés
        List<Terms> terms = convention.getTerms();
        if (terms != null && !terms.isEmpty()) {
            document.add(new Paragraph("Termes associés :"));
            for (Terms term : terms) {

                document.add(new Paragraph("Title: " + term.getTitle()));
                document.add(new Paragraph("Description: " + term.getDescription()));
                document.add(new Paragraph("\n"));
            }
        } else {
            document.add(new Paragraph("Aucun terme associé trouvé."));
        }

        // Fermer le document
        document.close();

        // Retourner le contenu du PDF en tant que tableau d'octets
        return byteArrayOutputStream.toByteArray();
    }
}
