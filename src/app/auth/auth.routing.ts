import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { AuthModule } from './auth.module';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  { 
    path:'',component:AuthComponent
  /*   children:[
      {path:'login',component:LoginComponent},
      {path:'signup',component:RegistrationComponent},
    ] */
   },
];

export const AuthRoutes = RouterModule.forChild(routes);
