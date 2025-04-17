import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-app-analyze',
  templateUrl: './app-analyze.component.html',
  styleUrls: ['./app-analyze.component.css']
})
export class AppAnalyzeComponent implements OnInit{
  applicationId!: number;
  analysisResult: any;
  loadingAnalysis: boolean = false;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.applicationId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchAnalysis();
  }

  fetchAnalysis(): void {
    this.loadingAnalysis = true;
    this.applicationService.getAnalyse(this.applicationId).subscribe({
      next: (result) => {
        this.analysisResult = result;
        this.loadingAnalysis = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch AI analysis.';
        this.loadingAnalysis = false;
        console.error(err);
      }
    });
  }
  goBack(): void {
    this.location.back();
  }
}
