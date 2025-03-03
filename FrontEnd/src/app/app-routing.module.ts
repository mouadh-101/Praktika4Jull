import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { UseTabComponent } from './components/use-tab/use-tab.component';
import { StudentProfileComponent } from './components/studentProfile/studentProfile.component';
import { InternshipComponent } from './components/internship/internship.component';
import { AddInternshipComponent } from './components/add-internship/add-internship.component';
import { UpdateInternshipComponent } from './components/update-internship/update-internship.component';
import { InternshipDetailsComponent } from './components/internship-details/internship-details.component';
import { FavorisComponent } from './components/favoris/favoris.component';


const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  {path:'users',component:UseTabComponent},
  {path:'student',component:StudentProfileComponent},
  { path: 'internships', component: InternshipComponent},
  { path: 'internships/add', component: AddInternshipComponent },
  { path: 'internships/edit/:id', component: UpdateInternshipComponent },
  { path: 'internships/details/:id', component: InternshipDetailsComponent },
  { path: 'favoris', component: FavorisComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
