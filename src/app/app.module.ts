import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import {MatInputModule} from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToolbarComponent } from './toolbar/toolbar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import {MatSidenavModule} from '@angular/material/sidenav';
import { AppPersonModule } from './app-person/app-person.module';
import { SidenavComponent } from './sidenav/sidenav.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import { AllInterceptors } from 'src/interceptors';
import { AppBloodModule } from './app-blood/app-blood.module';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecentBloodRequestsComponent } from './recent-BloodRequests/recent-BloodRequests.component';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import { RequestBloodDialogComponent } from './SharedComponents/request-blood-dialog/request-blood-dialog.component';
import {MatSelectModule} from '@angular/material/select';
import { PrivateChatComponentComponent } from './private-ChatComponent/private-ChatComponent.component';
import { TimeagoModule } from 'ngx-timeago';
import { SendMessageDialogComponent } from './SharedComponents/send-message-dialog/send-message-dialog.component';
import {MatTooltipModule} from '@angular/material/tooltip';


@NgModule({
  declarations: [								
    AppComponent,
      ToolbarComponent,
      SidenavComponent,
      RecentBloodRequestsComponent,
      RequestBloodDialogComponent,
      PrivateChatComponentComponent,
      SendMessageDialogComponent,
   ],
  imports: [
    RouterModule.forRoot(appRoutes),
    FlexLayoutModule,
    AuthModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatInputModule,
    MatToolbarModule,
    MatSidenavModule,
    AppPersonModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule,
    AppBloodModule,
    MatIconModule,
    FormsModule,
    MatListModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatTooltipModule,
    TimeagoModule.forRoot()
  ],
  providers: [
    AllInterceptors
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
