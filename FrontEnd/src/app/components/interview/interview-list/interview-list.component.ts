import { Component, OnInit } from '@angular/core';
import { Interview, InterviewService } from 'src/app/services/interview.service';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';



@Component({
  selector: 'app-interview-list',
  templateUrl: './interview-list.component.html',
  styleUrls: ['./interview-list.component.css']
})
export class InterviewListComponent implements OnInit {
  interviews: Interview[] = [];
  searchTerm: string = '';
  p: number = 1; // Page actuelle pour la pagination

  constructor(private interviewService: InterviewService, private router: Router) {}

  ngOnInit(): void {
    this.loadInterviews();
  }

  loadInterviews(): void {
    this.interviewService.getAllInterviews().subscribe(data => {
      this.interviews = data;
    });
  }

  deleteInterview(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette interview ?')) {
      this.interviewService.deleteInterview(id).subscribe(() => {
        this.loadInterviews(); // Recharger la liste après suppression
      });
    }
  }

  navigateToAdd(): void {
    this.router.navigate(['/interviews/add']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/interviews/edit', id]);
  }

  navigateToCalendar() {
    this.router.navigate(['/calendar']); // Assurez-vous que '/calendrier' est le bon chemin pour votre page du calendrier
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'SCHEDULED': return 'status-scheduled';
      case 'COMPLETED': return 'status-completed';
      case 'CANCELED': return 'status-canceled';
      default: return '';
    }
  }




  exportToPDF(): void {
    const doc = new jsPDF();

    // Ajouter un titre
    doc.setFontSize(18);
    doc.text("Liste des Interviews", 10, 10);

    // Ajouter la date de création
    const date = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.text("Date de création: " + date, 10, 20);

    // Définir les colonnes et les lignes du tableau
    const colHeaders = ["ID", "Date", "Lieu", "Notes", "Statut"];
    const rowData = this.interviews.map(interview => [
      interview.interviewId || "-", // Gérer le cas où l'ID est undefined
      interview.dateInterview || "-",
      interview.location || "-",
      interview.notes || "-",
      interview.status || "-",
    ]);

    // Générer le tableau
    autoTable(doc, {
      head: [colHeaders],
      body: rowData,
      startY: 30, // Ajuster en fonction de la place pour la date
      didDrawPage: (data) => {
        // Ajouter le numéro de page à chaque page
        const pageCount = doc.internal.pages.length;
        const currentPage = data.pageNumber;
        doc.setFontSize(10);
        doc.text(`Page ${currentPage} sur ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    // Télécharger le fichier PDF
    doc.save("Interviews.pdf");
  }






  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.interviews);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Interviews");

    XLSX.writeFile(wb, "Interviews.xlsx");
  }

}


