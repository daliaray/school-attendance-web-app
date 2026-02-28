import { LoginnComponent } from './admin/components/loginn/loginn.component';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree, CanActivateFn, CanActivateChildFn, Route, UrlSegment } from '@angular/router';
import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AdminDashboardComponent } from './admin/components/admin-dashboard/admin-dashboard.component';
import { AdminGuard } from './service/admin.guard';
import { Login1Component } from './login1/login1.component';

import { TeachComponent } from './teacher/teach/teach.component';
import { ParentdasboardComponent } from './parente/parentdasboard/parentdasboard.component';
import { ParenteComponent } from './parente/parente.component';

const routes: Routes = [
 
  {path: 'admin' , component : AdminComponent, children : [
   
    { path : 'loginn', component : LoginnComponent},
    {
      path: 'admin-dashboard',
      canActivate: [AdminGuard],
      component: AdminDashboardComponent
    }
   
  ]},
  {
    path : '',redirectTo :'login1' , pathMatch:'full'
  }, 
  { path: 'login1', component: Login1Component },
  
  { path: 'parente', component: ParenteComponent, children: [
    {
      path: 'parentdashboard',
      canActivate: [AdminGuard],
      component: ParentdasboardComponent
    }
  ]},
  {
    path: 'teacher/teach',
    component: TeachComponent, canActivate: [AdminGuard], // Replace with the actual component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
