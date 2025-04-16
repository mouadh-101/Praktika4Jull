import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// Import Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { UseTabComponent } from './components/use-tab/use-tab.component';
import { StudentProfileComponent } from './components/studentProfile/studentProfile.component';
import { SkillComponent } from './components/skill/skill.component';
import { EducationComponent } from './components/education/education.component';

import { TermsComponent } from './components/terms/terms.component';
import { TermDetailComponent } from './components/term-detail/term-detail.component';
import { ConventionDetailComponent } from './components/convention-detail/convention-detail.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import { UpdateInternshipComponent } from './components/update-internship/update-internship.component';
import { AddInternshipComponent } from './components/add-internship/add-internship.component';
import { InternshipDetailsComponent } from './components/internship-details/internship-details.component';
import { InternshipComponent } from './components/internship/internship.component';
import { FavorisComponent } from './components/favoris/favoris.component';
import { InterviewComponent } from './components/interview/interview.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterPipe } from './pipes/filter.pipe';
import { InterviewAddComponent } from './components/interview/interview-add/interview-add.component';
import { InterviewListComponent } from './components/interview/interview-list/interview-list.component';
import { InterviewEditComponent } from './components/interview/interview-edit/interview-edit.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { CalendarModule } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalenderComponent } from './components/calender/calender.component';
import { ListDocumentComponent } from './components/Document/ListDocument/ListDocument.component';
import { AddDocumentComponent } from './components/Document/AddDocument/AddDocument.component';
import { UpdateDocumentComponent } from './components/Document/updateDocument/updateDocument.component';
import { DocumentBackComponent } from './components/Document/DocumentBack/DocumentBack.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraActComponent } from './components/extra-act/extra-act.component';
import { WorkExpComponent } from './components/work-exp/work-exp.component';
import { ProfileUpdateComponent } from './components/profile-update/profile-update.component';
import { AuthGuard } from './guards/auth.guard';
import { NgxPaginationModule } from 'ngx-pagination';
import { ExportCvComponent } from './components/export-cv/export-cv.component';
import { WebsocketComponent } from './components/websocket/websocket.component';

import { ChatComponent } from './components/chat/chat.component';
import { VideoCallComponent } from './components/video-call/video-call.component';
import { AddApplicationDialogComponent } from './components/add-application/add-application.component';
import { StudentApplicationsComponent } from './components/student-applications/student-applications.component';
import { ApplicationDetailsComponent } from './components/application-details/application-details.component';


@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    NavbarComponent,
    FooterComponent,
    UseTabComponent,
    StudentProfileComponent,
    SkillComponent,
    EducationComponent,
    TermsComponent,
    TermDetailComponent,
    ConventionDetailComponent,
    UpdateInternshipComponent,
    AddInternshipComponent,
    InternshipDetailsComponent,
    InternshipComponent,
    FavorisComponent,
    InterviewComponent,
    FilterPipe,
    InterviewAddComponent,
    InterviewListComponent,
    InterviewEditComponent,
    CalenderComponent,
    ListDocumentComponent,
    AddDocumentComponent,
    UpdateDocumentComponent,
    DocumentBackComponent,
    ExtraActComponent,
    WorkExpComponent,
    ProfileUpdateComponent,
    ExportCvComponent,
    ChatComponent,
    VideoCallComponent,
    AddApplicationDialogComponent,
    WebsocketComponent,
    StudentApplicationsComponent,
    ApplicationDetailsComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    FormsModule,
    NgbModule,
    NgxPaginationModule,
    FullCalendarModule,
    MatNativeDateModule,
    CalendarModule.forRoot({ provide: DateAdapter, useClass: MatNativeDateModule }),
    BrowserAnimationsModule,
    MatButtonModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
     useClass: AuthInterceptor,
     multi: true // Use multiple interceptors if needed

   }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
