import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { UseTabComponent } from './components/use-tab/use-tab.component';
import { StudentProfileComponent } from './components/studentProfile/studentProfile.component';
import { PostsComponent } from './components/posts/posts.component';
import { HomeComponent } from './components/home/home.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { FormationComponent } from './components/formation/formation.component';
import { DiplomeComponent } from './components/diplome/diplome.component';
import { ExamenComponent } from './components/examen/examen.component';
import { FormationsclientComponent } from './formationsclient/formationsclient.component';
import { ExmanComponent } from './exman/exman.component';

const routes: Routes = [
  {path:'',redirectTo:"home",pathMatch:"full"},
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  {path:'users',component:UseTabComponent},
  {path:'home',component:HomeComponent},
  {path:'chatbot',component:ChatbotComponent},
  {path:'formations',component:FormationComponent},
  {path:'formationsclient',component:FormationsclientComponent},
  {path:'examn/:id',component:ExmanComponent},

  {path:'diplome',component:DiplomeComponent},
  {path:'examen/:id',component:ExamenComponent},
  {path:'student',component:StudentProfileComponent},
  { path: 'post', component: PostsComponent },

  { path: '', redirectTo: '/', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
