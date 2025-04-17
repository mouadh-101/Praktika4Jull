import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { UseTabComponent } from './components/use-tab/use-tab.component';
import { StudentProfileComponent } from './components/studentProfile/studentProfile.component';
import {TermDetailComponent} from "./components/term-detail/term-detail.component";
import {TermsComponent} from "./components/terms/terms.component";
import {ConventionComponent} from "./components/convention/convention.component";
import {ConventionDetailComponent} from "./components/convention-detail/convention-detail.component";
import { QuizListComponent } from './components/quiz-list/quiz-list.component';
import { QuizFormComponent } from './components/quiz-form/quiz-form.component';

const routes: Routes = [
  { path: 'terms', component: TermsComponent },
  { path: 'quizzes', component: QuizListComponent },
  { path: 'quizzes/add', component: QuizFormComponent },
  // { path: 'quizzes/edit/:id', component: QuizFormComponent },
  { path: '', redirectTo: '/quizzes', pathMatch: 'full' },
  { path: 'terms/:id', component: TermDetailComponent },
  { path: 'conventions/:id', component: ConventionDetailComponent },
  { path: 'conventions', component: ConventionComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  {path:'users',component:UseTabComponent},
  {path:'student',component:StudentProfileComponent},
  { path: '', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
