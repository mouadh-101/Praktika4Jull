import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { UseTabComponent } from './components/use-tab/use-tab.component';
import { AuthGuard } from './guards/auth.guard';
import { LogoutComponent } from './components/logout/logout.component';
import { CvComponent } from './components/cv/cv.component';
import { InterviewListComponent } from './components/interview/interview-list/interview-list.component';
import { InterviewAddComponent } from './components/interview/interview-add/interview-add.component';
import { InterviewEditComponent } from './components/interview/interview-edit/interview-edit.component';


const routes: Routes = [
  { path: 'users', component: UseTabComponent , canActivate: [AuthGuard] },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path:'logout',component:LogoutComponent,canActivate: [AuthGuard]},
  {path :'cv',component:CvComponent,canActivate: [AuthGuard]},

  { path: 'interviews', component: InterviewListComponent },
  { path: 'interviews/add', component: InterviewAddComponent },
  { path: 'interviews/edit/:id', component: InterviewEditComponent },

  { path: '', redirectTo: '/interviews', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
