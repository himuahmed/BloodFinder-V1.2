import { Component, OnInit } from '@angular/core';
import { BloodRequestPost } from '../global-interfaces/bloodRequestPost';
import { BloodRequestsServiceService } from '../shared-services/blood-RequestsService.service';
import { forEach as _forEach, cloneDeep as _cloneDeep } from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { RequestBloodDialogComponent } from '../SharedComponents/request-blood-dialog/request-blood-dialog.component';
import { AuthService } from '../auth/services/auth.service';
import { SendMessageDialogComponent } from '../SharedComponents/send-message-dialog/send-message-dialog.component';
import { Router } from '@angular/router';
import { UserServiceService } from '../shared-services/user-service.service';



@Component({
  selector: 'app-recent-BloodRequests',
  templateUrl: './recent-BloodRequests.component.html',
  styleUrls: ['./recent-BloodRequests.component.scss']
})
export class RecentBloodRequestsComponent implements OnInit {
  loggedInUserId:string = '';
  bloodReqPosts:BloodRequestPost[] = [];
  constructor(private bloodReqService: BloodRequestsServiceService,public dialog: MatDialog,public authService: AuthService,private userService:UserServiceService, private router:Router) { }

  ngOnInit() {
    if(this.authService.isLoggedIn()){
      this.loggedInUserId = this.userService.getLoggedinUserId();
    }
      try{
        this.fetchAllBloodRequests();
      }catch(Err){
        setTimeout(() => {
          this.fetchAllBloodRequests()
        }, 5000);
      }
    
  }

  fetchAllBloodRequests(){
    this.bloodReqService.fetchBloodRequestPosts().subscribe(res=>{
      if(res.result){
        console.log(res);
        if(res.result != null){
          let tempArr = this.bloodReqPosts;
          _forEach(res.result, function(msg){
            tempArr.unshift(msg);
          })
          this.bloodReqPosts = tempArr;
      }
    }
  });
  }

  openDialog() {
    this.dialog.open(RequestBloodDialogComponent);
  }

  openMessageDialog(receiverId, name) {
    if(this.authService.isLoggedIn()){
      this.dialog.open(SendMessageDialogComponent,{
        data:{userId: receiverId, name: name},
      });
    }
    else{
      this.router.navigate(['auth']);
    }

  }

}

