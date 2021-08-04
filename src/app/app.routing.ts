import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { PrivateChatComponentComponent } from './private-ChatComponent/private-ChatComponent.component';


export const appRoutes: Routes = [
  {path: '', redirectTo:'', pathMatch:'full'},
  {path:'auth', loadChildren:()=> import('./auth/auth.module').then(r=>r.AuthModule)},
  {path:'dashboard', loadChildren:()=> import('./app-blood/app-blood.module').then(r=>r.AppBloodModule)},
  {path:'user', loadChildren:()=> import('./app-person/app-person.module').then(r=>r.AppPersonModule)},
  {path:'messages', component:PrivateChatComponentComponent, canActivate:[AuthGuard]},
  {path: '**', redirectTo: 'dashboard', pathMatch:'full'}
];

