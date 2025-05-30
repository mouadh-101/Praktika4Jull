import { Component, OnInit } from '@angular/core'; // Added OnInit
import { Terms } from "../../core/model/db";
import { TermsService } from "../../services/terms.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // Added DomSanitizer

@Component({
  selector: 'app-term-detail',
  templateUrl: './term-detail.component.html',
  styleUrls: ['./term-detail.component.css']
})
export class TermDetailComponent implements OnInit { // Implemented OnInit
  term: Terms | undefined;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private termsService: TermsService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer // Injected DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadTerm();
  }

  loadTerm(): void {
    this.isLoading = true;
    this.errorMessage = null;
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const termId = +idParam;
       if (isNaN(termId) || termId <= 0) {
        console.error('Invalid Term ID provided.');
        this.errorMessage = 'Invalid Term ID. Cannot load details.';
        this.isLoading = false;
        return;
      }
      this.termsService.getTermById(termId).subscribe({
        next: (data) => {
          this.term = data;
          this.isLoading = false;
          if (!data) { // Handle case where service returns null/undefined for not found
            this.errorMessage = 'The requested term or policy could not be found.';
          }
        },
        error: (error) => {
          console.error('Error fetching term details:', error);
          this.errorMessage = 'Failed to load term details. ' + (error.error?.message || error.message);
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'No Term ID found in route.';
      this.isLoading = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/terms']); // Navigate back to the terms list
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
