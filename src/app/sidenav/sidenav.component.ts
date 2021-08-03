import { Component, OnInit } from '@angular/core';
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
export class SidenavComponent implements OnInit {

  showFiller = true;
  isLoggedIn = false;
  isPersonLoaded = false;
  personn:Person;
  panelOpenState = false;
  constructor(private authService: AuthService, private userService:UserServiceService, private router:Router, private privateChatService: PrivateChatServiceService) { }

  ngOnInit() {

  }

  toggleSideNav(drawer:any){
    this.isLoggedIn =  this.authService.isLoggedIn() ? true : false;
    if(this.isLoggedIn)
    {
      if(!this.isPersonLoaded){
        this.getPersonName();
      }
      drawer.toggle();
    }
  }

  getPersonName(){
    this.userService.getPersonByUserId().subscribe((res: Person) =>{
      if(res){
        this.personn = res;
        this.isPersonLoaded = true;
      }
    })
   }

   logout(drawer:any){
      drawer.toggle();
     this.authService.logOut();
     this.router.navigate(['']);
   }

}
