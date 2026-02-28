import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminAuthService } from 'src/app/admin/service/admin-auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit  {

  username: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AdminAuthService
  ) {}

  ngOnInit(): void {
    this.authService.username$.subscribe((username) => {
      this.username = username;
    });
  }

}
