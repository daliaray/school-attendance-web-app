import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReactiveFormsModule } from '@angular/forms';
import { Login1Component } from './login1/login1.component';
import { TeachComponent } from './teacher/teach/teach.component';

import { FormsModule } from '@angular/forms';


import { ParenteComponent } from './parente/parente.component';
import { ParentdasboardComponent } from './parente/parentdasboard/parentdasboard.component';
import { HeaderComponent } from './parente/parentdasboard/header/header.component';


@NgModule({
  declarations: [
    AppComponent,
   Login1Component,
  TeachComponent,
  HeaderComponent,
  ParenteComponent,
  ParentdasboardComponent,
    
  
 ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AdminModule,
    BrowserAnimationsModule, 
    ReactiveFormsModule,
    FormsModule,
    CommonModule, 
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
