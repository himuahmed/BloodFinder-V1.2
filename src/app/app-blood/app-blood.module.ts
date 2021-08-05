import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBloodComponent } from './app-blood.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { BloodGroupsSummeryComponent } from './bloodGroupsSummery/bloodGroupsSummery.component';
import { BloodSearchComponent } from './bloodSearch/bloodSearch.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MapComponent } from './map/map.component';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GlobalChatComponent } from '../global-chat/global-chat.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    FormsModule,  
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  declarations: [
    AppBloodComponent,
    BloodGroupsSummeryComponent,
    BloodSearchComponent,
    MapComponent,
    GlobalChatComponent
  ]
})
export class AppBloodModule { }
