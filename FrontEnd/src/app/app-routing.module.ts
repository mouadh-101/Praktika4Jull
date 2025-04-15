import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { UseTabComponent } from './components/use-tab/use-tab.component';
import { StudentProfileComponent } from './components/studentProfile/studentProfile.component';
import {TermDetailComponent} from "./components/term-detail/term-detail.component";
import {TermsComponent} from "./components/terms/terms.component";
import {ConventionDetailComponent} from "./components/convention-detail/convention-detail.component";


import { InternshipComponent } from './components/internship/internship.component';
import { AddInternshipComponent } from './components/add-internship/add-internship.component';
import { UpdateInternshipComponent } from './components/update-internship/update-internship.component';
import { InternshipDetailsComponent } from './components/internship-details/internship-details.component';
import { FavorisComponent } from './components/favoris/favoris.component';

import { AuthGuard } from './guards/auth.guard';
import { InterviewEditComponent } from './components/interview/interview-edit/interview-edit.component';
import { InterviewAddComponent } from './components/interview/interview-add/interview-add.component';
import { InterviewListComponent } from './components/interview/interview-list/interview-list.component';

import { CalenderComponent } from './components/calender/calender.component';
import { ListDocumentComponent } from './components/Document/ListDocument/ListDocument.component';
import { AddDocumentComponent } from './components/Document/AddDocument/AddDocument.component';
import { UpdateDocumentComponent } from './components/Document/updateDocument/updateDocument.component';
import { DocumentBackComponent } from './components/Document/DocumentBack/DocumentBack.component';
import { WebsocketComponent } from './components/websocket/websocket.component';
import { ChatComponent } from './components/chat/chat.component';
import { VideoCallComponent } from './components/video-call/video-call.component';

const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },

  { path: 'interviews', component: InterviewListComponent,canActivate: [AuthGuard]  },
  { path: 'interviews/add', component: InterviewAddComponent },
  { path: 'interviews/edit/:id', component: InterviewEditComponent },
  { path: 'calendar', component:CalenderComponent },


  {path:'ListDocument',component:ListDocumentComponent,canActivate: [AuthGuard] },
  {path:'AddDocument',component:AddDocumentComponent,canActivate: [AuthGuard] },
  {path:'UpdateDocument/:id',component:UpdateDocumentComponent,canActivate: [AuthGuard] },
  {path:'DocumentBack',component:DocumentBackComponent},
  {path:'student',component:StudentProfileComponent,canActivate: [AuthGuard] },
  { path: 'internships', component: InternshipComponent,canActivate: [AuthGuard] },
  { path: 'internships/add', component: AddInternshipComponent,canActivate: [AuthGuard]  },
  { path: 'internships/edit/:id', component: UpdateInternshipComponent,canActivate: [AuthGuard]  },
  { path: 'internships/details/:id', component: InternshipDetailsComponent,canActivate: [AuthGuard]  },
  { path: 'favoris', component: FavorisComponent },
  { path: 'chat', component: WebsocketComponent},
  { path: 'chatapp', component: ChatComponent},
  {
    path: 'video-call',
    component: VideoCallComponent
  },

  { path: 'terms', component: TermsComponent },
  { path: 'terms/:id', component: TermDetailComponent },
  { path: 'conventions/:id', component: ConventionDetailComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



