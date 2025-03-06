import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { UseTabComponent } from './components/use-tab/use-tab.component';
import { StudentProfileComponent } from './components/studentProfile/studentProfile.component';
import { InterviewEditComponent } from './components/interview/interview-edit/interview-edit.component';
import { InterviewAddComponent } from './components/interview/interview-add/interview-add.component';
import { InterviewListComponent } from './components/interview/interview-list/interview-list.component';

import { CalenderComponent } from './components/calender/calender.component';
import { ListDocumentComponent } from './components/Document/ListDocument/ListDocument.component';
import { AddDocumentComponent } from './components/Document/AddDocument/AddDocument.component';
import { UpdateDocumentComponent } from './components/Document/updateDocument/updateDocument.component';
import { DocumentBackComponent } from './components/Document/DocumentBack/DocumentBack.component';

const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  {path:'users',component:UseTabComponent},
  {path:'student',component:StudentProfileComponent},

  { path: 'interviews', component: InterviewListComponent },
  { path: 'interviews/add', component: InterviewAddComponent },
  { path: 'interviews/edit/:id', component: InterviewEditComponent },
  { path: 'calendar', component:CalenderComponent },


  {path:'ListDocument',component:ListDocumentComponent},
  {path:'AddDocument',component:AddDocumentComponent},
  {path:'UpdateDocument/:id',component:UpdateDocumentComponent},
  {path:'DocumentBack',component:DocumentBackComponent},



  { path: '', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
