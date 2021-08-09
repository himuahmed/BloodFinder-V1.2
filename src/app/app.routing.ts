import { Routes } from '@angular/router';
import { AppBloodComponent } from './app-blood/app-blood.component';
import { AddPersonDetailsComponent } from './app-person/add-person-details/add-person-details.component';
import { PersonProfileComponent } from './app-person/personProfile/personProfile.component';
import { AuthComponent } from './auth/auth.component';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './guards/auth.guard';
import { PrivateChatComponentComponent } from './private-ChatComponent/private-ChatComponent.component';
import { SidenavComponent } from './sidenav/sidenav.component';


export const appRoutes: Routes = [
  //{path: '', redirectTo:'', pathMatch:'full'},
  {path: 'auth', component:AuthComponent},
  //{path:'auth', loadChildren:()=> import('./auth/auth.module').then(r=>r.AuthModule)},
  //{path:'dashboard', loadChildren:()=> import('./app-blood/app-blood.module').then(r=>r.AppBloodModule)},
  {
    path:'', component:SidenavComponent,
    children:[
      {path: '', component:AppBloodComponent},
      /* {path:'user', loadChildren:()=> import('./app-person/app-person.module').then(r=>r.AppPersonModule)}, */
      {path:'user', component:PersonProfileComponent, canActivate:[AuthGuard]},
      {path:'user/add-person-info', component:AddPersonDetailsComponent, canActivate:[AuthGuard]},
      {path:'messages', component:PrivateChatComponentComponent, canActivate:[AuthGuard]},
    ]
  },

  {path: '**', redirectTo: '', pathMatch:'full'}

];

