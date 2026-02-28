

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';

import { LoginnComponent } from './components/loginn/loginn.component';
import { RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ClassesComponent } from './components/admin-dashboard/classes/classes.component';
import { StudentsComponent } from './components/admin-dashboard/students/students.component';
import { HomeComponent } from './components/admin-dashboard/home/home.component';
import { TeachersComponent } from './components/admin-dashboard/teachers/teachers.component';
import { AttendanceComponent } from './components/admin-dashboard/attendance/attendance.component';
import { SignoutComponent } from './components/admin-dashboard/signout/signout.component';
import { HeaderComponent } from './components/admin-dashboard/header/header.component';





@NgModule({
  declarations: [
    AdminComponent,
    LoginnComponent,
    AdminDashboardComponent,
    ClassesComponent,
    StudentsComponent,
    HomeComponent,
    TeachersComponent,
    AttendanceComponent,
    SignoutComponent,
    HeaderComponent


  
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,

    
    BrowserAnimationsModule,
     // * MATERIAL IMPORTS
     MatSidenavModule,
     MatToolbarModule,
     MatMenuModule,
     MatIconModule,
     MatDividerModule,
     MatListModule,
  
  ]
  
  
})
export class AdminModule { }
