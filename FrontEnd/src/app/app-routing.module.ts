import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { UseTabComponent } from './components/use-tab/use-tab.component';
import { StudentProfileComponent } from './components/studentProfile/studentProfile.component';
import { ListDocumentComponent } from './components/Document/ListDocument/ListDocument.component';
import { AddDocumentComponent } from './components/Document/AddDocument/AddDocument.component';
import { UpdateDocumentComponent } from './components/Document/updateDocument/updateDocument.component';
import { DocumentBackComponent } from './components/Document/DocumentBack/DocumentBack.component';
import { DepotComponent } from './components/Document/Depot/Depot.component';
import { DepotBackComponent } from './components/Document/DepotBack/DepotBack.component';
import { ListJournalComponent } from './components/Document/ListJournal/ListJournal.component';
import { AddJournalComponent } from './components/Document/AddJournal/AddJournal.component';
import { JournalbackComponent } from './components/Document/Journalback/Journalback.component';
import { UpdateJournalComponent } from './components/Document/UpdateJournal/UpdateJournal.component';

const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  {path:'users',component:UseTabComponent},
  {path:'student',component:StudentProfileComponent},
  {path:'ListDocument',component:ListDocumentComponent},
  {path:'AddDocument',component:AddDocumentComponent},
  {path:'UpdateDocument/:id',component:UpdateDocumentComponent},
  {path:'DocumentBack',component:DocumentBackComponent},
{path:'depot/:id', component:DepotComponent},
{path:'depotback/:id', component:DepotBackComponent},
{path:'ListJournal/:id', component:ListJournalComponent},
{path:'AddJournal/:id', component:AddJournalComponent},
{path:'JournalBack/:id', component:JournalbackComponent},
{path:'UpdateJournal/:id',component:UpdateJournalComponent},





  { path: '', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
