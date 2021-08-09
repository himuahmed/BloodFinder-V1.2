/* import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { AddPersonDetailsComponent } from './add-person-details/add-person-details.component';
import { PersonProfileComponent } from './personProfile/personProfile.component';

const routes: Routes = [
  { 
    path:'user',
    children:[
      {path:'',component:PersonProfileComponent, canActivate:[AuthGuard]},
      {path:'add-person-info',component:AddPersonDetailsComponent, canActivate:[AuthGuard]}
    ]
   },
];

export const PersonRoutes = RouterModule.forChild(routes);
 */