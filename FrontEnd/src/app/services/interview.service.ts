import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Interview {
  interviewId?: number;
  dateInterview: string;
  location: string;
  notes: string;
  status: string;
}

export interface DemandeInterview {
  DemandeInterviewId?: number;
   statuss: string;
     Date1:Date;
     Date2:Date;
     Date3:Date;
     IsRemote:boolean;
     Description:String;
     Location:String
}

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private apiUrl = 'http://localhost:8222/api/interview';

  constructor(private http: HttpClient) {}

  getAllInterviews(): Observable<Interview[]> {
    return this.http.get<Interview[]>(`${this.apiUrl}/list`);
  }

  getInterviewById(id: number): Observable<Interview> {
    return this.http.get<Interview>(`${this.apiUrl}/Interview/${id}`);
  }

  addInterview(interview: Interview): Observable<Interview> {
    return this.http.post<Interview>(`${this.apiUrl}/AddInterview`, interview);
  }

  deleteInterview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Interview/${id}`);
  }

  updateInterview(interview: Interview): Observable<Interview> {
    return this.http.put<Interview>(`${this.apiUrl}/Interview/update/${interview.interviewId}`, interview);
  }
}
