import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminauthTsService } from 'src/app/service/adminauth.ts.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  username: string = '';
  constructor(
    private route: ActivatedRoute,
    private authService1:AdminauthTsService
  ) {}

  ngOnInit(): void {
    this.authService1.username$.subscribe((username) => {
      this.username = username;
    });

}}
