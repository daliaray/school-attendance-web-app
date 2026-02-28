import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent  implements OnInit{

  home :boolean=false;
  class :boolean=false;
  teacher :boolean=false;
  student :boolean=false;
  attendance :boolean=false;

  constructor( private router:Router){}
    ngOnInit():void {
      this.showhome();

    }

    setoff(){
      this.home=false;
      this.class=false;
      this.teacher=false;
      this.student=false;
      this.attendance=false;
 
    }
  showhome(){
    this.setoff();
    this.home=true;

  }
  showclasses(){
    this.setoff();
    this.class=true;

  }
  showteachers(){
    this.setoff();
    this.teacher=true;

  }
  showstudents(){
    this.setoff();
    this.student=true;

  }
  showattendance(){
    this.setoff();
    this.attendance=true;

  }
  signout(){
    localStorage.removeItem("token");
    this.router.navigate(['login1']);

  }



}
