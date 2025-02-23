import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UseTabComponent } from './components/use-tab/use-tab.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LogoutComponent } from './components/logout/logout.component';
import { CvComponent } from './components/cv/cv.component';
import { InterviewComponent } from './components/interview/interview.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { InterviewListComponent } from './components/interview/interview-list/interview-list.component';
import { InterviewAddComponent } from './components/interview/interview-add/interview-add.component';
import { InterviewEditComponent } from './components/interview/interview-edit/interview-edit.component';
import { FilterPipe } from './pipes/filter.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';





@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    SignInComponent,
    SignUpComponent,
    UseTabComponent,
    LogoutComponent,
    CvComponent,
    InterviewComponent,
    InterviewListComponent,
    InterviewAddComponent,
    InterviewEditComponent,
    FilterPipe,




  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    NgbModule,

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
  /* constructor(private keycloak: KeycloakService) {}

  async ngDoBootstrap(appRef: any) {
    try {
      // Initialize Keycloak
      const initialized = await initializeKeycloak()();
      if (!initialized) {
        throw new Error('Keycloak initialization failed');
      }

      if (await this.keycloak.isLoggedIn()) {
        console.log('User is logged in:', this.keycloak.getUsername());
      }

      appRef.bootstrap(AppComponent); // Bootstrap the application after Keycloak is initialized
    } catch (error) {
      console.error('Error during Keycloak initialization:', error);
    }
  }*/
}
