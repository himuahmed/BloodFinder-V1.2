import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { UserServiceService } from '../shared-services/user-service.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  personName:string;
  @Output() sideNavOperation:EventEmitter<boolean> = new EventEmitter<boolean>();
  sideNavOpened = true;
  constructor(private userService:UserServiceService,private authService:AuthService) { }

  ngOnInit() {
    
  }

  isLoggedIn(){    
    return this.authService.isLoggedIn();
  }

  sideNav(){
    this.sideNavOperation.emit(this.sideNavOpened);
    this.sideNavOpened = !this.sideNavOpened;
  }

}
