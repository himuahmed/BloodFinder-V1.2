import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Person } from '../app-person/interfaces/person';
import { AuthService } from '../auth/services/auth.service';
import { PrivateChatServiceService } from '../shared-services/private-ChatService.service';
import { UserServiceService } from '../shared-services/user-service.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {

  showFiller = true;
  isLoggedIn = false;
  personn:Person;
  panelOpenState = false;
  showBloodRequestPosts = true;
  constructor(private authService: AuthService, private userService:UserServiceService, private router:Router, private privateChatService: PrivateChatServiceService,
    private readonly titleService: Title) {
      this.titleService.setTitle('Blood Donors')
   }

  ngOnInit() {


    
  }

  ngOnDestroy(){
    this.showBloodRequestPosts = false;
  }

  toggleSideNav(drawer:any){
    this.personn = this.userService.loggedInPerson;
    this.isLoggedIn =  this.authService.isLoggedIn() ? true : false;
    if(this.isLoggedIn && this.personn)
    {
      drawer.toggle();
    }
  }

  sideNavOperation(drawer:any){
    this.toggleSideNav(drawer);
  }

   logout(drawer:any){
      drawer.toggle();
      this.authService.logOut();
      this.router.navigate(['']);
   }

}
