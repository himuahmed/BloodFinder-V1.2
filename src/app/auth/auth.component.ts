import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private authService:AuthService, private router:Router,private readonly titleService: Title) {
    this.titleService.setTitle('Blood Donors')
   }

  ngOnInit() {
    if(this.authService.isLoggedIn()){
      this.router.navigate(['user']);
    }
  }

}
