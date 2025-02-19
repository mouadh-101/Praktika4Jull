// src/app/components/cv/cv.component.ts

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css']
})
export class CvComponent implements OnInit {
  cvData = {
    name: 'John Doe', // Replace with actual user data
    email: 'john.doe@example.com',
    phone: '+123 456 7890',
    address: '123 Main St',

    careerObjective: 'Seeking a challenging position to utilize my skills.',

    education: [
      { degree: 'Diploma', field: 'Computer Science & Engineering', institution: 'Esprit', startDate: '2023', endDate: '2028' }
    ],

    workExperience: [
      { position: 'Software Developer', company: 'Tech Corp', startDate: '2022', endDate: 'Present', description: 'Developed web applications...' }
    ],

    extraCurricular: ['Volunteered at coding workshops', 'Participated in hackathons'],

    trainings: ['Advanced JavaScript Course', 'AWS Certification'],

    projects: [
      { title: 'E-commerce Website', description: 'Built an e-commerce platform using Angular and Spring Boot.' }
    ],

    skills: ['JavaScript', 'Angular', 'Spring Boot', 'Database Management'],

    portfolio: [
      { name: 'My Portfolio Website', link: 'https://example.com/portfolio' }
    ],

    accomplishments: [
      'Secured 1st rank in national-level story writing competition.',
      'Published research paper on AI.'
    ]
  };

  constructor() {}

  ngOnInit(): void {}
}