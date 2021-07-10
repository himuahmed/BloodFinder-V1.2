import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private authService:AuthService, private router:Router) { }

  ngOnInit() {
    if(this.authService.isLoggedIn()){
      this.router.navigate(['user']);
    }
  }

}
