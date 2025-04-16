package esprit.microservice1.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.LineSeparator;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.property.TextAlignment;
import esprit.microservice1.entities.User;
import esprit.microservice1.entity.Diplome;
import esprit.microservice1.entity.Formation;
import esprit.microservice1.entity.OurUsers;
import esprit.microservice1.repository.DiplomeRepository;
import esprit.microservice1.repository.ExamenRepository;
import esprit.microservice1.repository.FormationRepository;
import esprit.microservice1.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.File;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

@Service
public class DiplomeService {
    @Autowired
    private DiplomeRepository diplomeRepository;
    @Autowired
    private ExamenRepository examenRepository;
    @Autowired
    private FormationRepository formationRepository;
    @Autowired
    private UsersRepo usersRepo;
    @Autowired
    private  WebClient webClient;
    public Diplome createDiplome(Diplome diplome, Long idformation, Integer iduser) {
        Formation formation = formationRepository.findById(idformation)
                .orElseThrow(() -> new RuntimeException("Formation not found"));

        User user = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/users/userById")
                        .build())
                .header("userId", iduser.toString())
                .retrieve()
                .bodyToMono(User.class)
                .block();
        diplome.setFormation(formation);
        diplome.setIduser(Long.valueOf(user.getUserId()));
        System.out.println(diplome +""+ diplome.getDateObtention());
        return diplomeRepository.save(diplome);
    }


    public List<Diplome> getAllDiplomes() {
        return diplomeRepository.findAll();
    }

    public Optional<Diplome> getDiplomeById(Long id) {
        return diplomeRepository.findById(id);
    }

    public void deleteDiplome(Long id) {
        diplomeRepository.deleteById(id);
    }

    public Diplome updateDiplome(Long id, Diplome updatedDiplome) {
        return diplomeRepository.findById(id).map(diplome -> {
            diplome.setDateObtention(updatedDiplome.getDateObtention());
            diplome.setFormation(updatedDiplome.getFormation());
            return diplomeRepository.save(diplome);
        }).orElseThrow(() -> new RuntimeException("Diplôme avec ID " + id + " non trouvé"));
    }


    public void generateQRCode(String text, String filePath) throws Exception {
        int width = 300;
        int height = 300;
        String format = "png";

        BitMatrix bitMatrix = new MultiFormatWriter().encode(text, BarcodeFormat.QR_CODE, width, height);
        Path path = FileSystems.getDefault().getPath(filePath);
        MatrixToImageWriter.writeToPath(bitMatrix, format, path);
        System.out.println("📌 QR Code généré : " + filePath);
    }


    public String generateDiploma(Diplome diplome) throws Exception {
        String directoryPath = "diplomes";
        File directory = new File(directoryPath);
        if (!directory.exists()) {
            directory.mkdirs();
        }
        User user1 = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/users/userById")
                        .build())
                .header("userId", diplome.getIduser().toString())
                .retrieve()
                .bodyToMono(User.class)
                .block();
        String pdfFilePath = directoryPath + "/diplome_" + diplome.getId() + ".pdf";
        String nom = "diplome_" + diplome.getId() + ".pdf";
        String qrCodeFilePath = directoryPath + "/qrcode_" + diplome.getId() + ".png";
        String logoPath = "logo.png";

        String qrCodeText = "Diplôme ID: " + diplome.getId() + ", Étudiant: " + user1.getName();
        generateQRCode(qrCodeText, qrCodeFilePath);

        PdfWriter writer = new PdfWriter(pdfFilePath);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        try {
            ImageData logoData = ImageDataFactory.create(logoPath);
            Image logo = new Image(logoData).scaleToFit(100, 100);
            logo.setFixedPosition(50, 750);
            document.add(logo);
        } catch (Exception e) {
            System.err.println("⚠️ Logo non trouvé, génération sans logo.");
        }

        document.add(new Paragraph("Université Esprit")
                .setFontSize(22)
                .setBold()
                .setFontColor(new DeviceRgb(0, 0, 255))
                .setTextAlignment(TextAlignment.CENTER));
        document.add(new Paragraph("DIPLÔME OFFICIEL")
                .setFontSize(20)
                .setBold()
                .setFontColor(new DeviceRgb(0, 0, 0))
                .setTextAlignment(TextAlignment.CENTER));
        document.add(new LineSeparator(new SolidLine()));

        document.add(new Paragraph("\n"));

        document.add(new Paragraph("Nous certifions que :")
                .setFontSize(14)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER));
        document.add(new Paragraph(user1.getName())
                .setFontSize(18)
                .setBold()
                .setFontColor(new DeviceRgb(0, 0, 0)) // Noir
                .setTextAlignment(TextAlignment.CENTER));
        document.add(new Paragraph("a réussi la formation : " + diplome.getFormation().getTitre())
                .setFontSize(14)
                .setTextAlignment(TextAlignment.CENTER));
        document.add(new Paragraph("Date d'obtention : " + diplome.getDateObtention())
                .setFontSize(14)
                .setTextAlignment(TextAlignment.CENTER));

        document.add(new Paragraph("\n\n"));

        ImageData qrImageData = ImageDataFactory.create(qrCodeFilePath);
        Image qrImage = new Image(qrImageData).scaleToFit(100, 100);
        qrImage.setFixedPosition(450, 100);
        document.add(qrImage);

        document.add(new LineSeparator(new SolidLine()));
        document.add(new Paragraph("\nDirecteur de l'Université")
                .setFontSize(12)
                .setBold()
                .setTextAlignment(TextAlignment.LEFT));
        document.add(new Paragraph("_________________________")
                .setFontSize(12)
                .setTextAlignment(TextAlignment.LEFT));
        document.add(new Paragraph("\nResponsable de Formation")
                .setFontSize(12)
                .setBold()
                .setTextAlignment(TextAlignment.RIGHT));
        document.add(new Paragraph("_________________________")
                .setFontSize(12)
                .setTextAlignment(TextAlignment.RIGHT));
        document.close();
        System.out.println("📄 Diplôme généré avec succès : " + pdfFilePath);
        diplome.setPath(nom);
        diplomeRepository.save(diplome);
        return pdfFilePath;
    }


}
