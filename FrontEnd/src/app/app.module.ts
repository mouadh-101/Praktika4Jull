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
import { ListDocumentComponent } from './components/Document/ListDocument/ListDocument.component';
import { AddDocumentComponent } from './components/Document/AddDocument/AddDocument.component';
import { UpdateDocumentComponent } from './components/Document/updateDocument/updateDocument.component';
import { DocumentBackComponent } from './components/Document/DocumentBack/DocumentBack.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';
import { DepotComponent } from './components/Document/Depot/Depot.component';
import { DepotBackComponent } from './components/Document/DepotBack/DepotBack.component';
import { ListJournalComponent } from './components/Document/ListJournal/ListJournal.component';
import { AddJournalComponent } from './components/Document/AddJournal/AddJournal.component';
import { JournalbackComponent } from './components/Document/Journalback/Journalback.component';
import { UpdateJournalComponent } from './components/Document/UpdateJournal/UpdateJournal.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';



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
    ListDocumentComponent,
    AddDocumentComponent,
    UpdateDocumentComponent,
    DocumentBackComponent,
    DepotComponent,
    DepotBackComponent,
    ListJournalComponent,
    AddJournalComponent,
      JournalbackComponent,
      UpdateJournalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    NgxQRCodeModule
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
