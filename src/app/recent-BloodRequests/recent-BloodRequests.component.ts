import { Component, OnInit } from '@angular/core';
import { BloodRequestPost } from '../global-interfaces/bloodRequestPost';
import { BloodRequestsServiceService } from '../shared-services/blood-RequestsService.service';
import { forEach as _forEach, cloneDeep as _cloneDeep } from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { RequestBloodDialogComponent } from '../SharedComponents/request-blood-dialog/request-blood-dialog.component';
import { AuthService } from '../auth/services/auth.service';



@Component({
  selector: 'app-recent-BloodRequests',
  templateUrl: './recent-BloodRequests.component.html',
  styleUrls: ['./recent-BloodRequests.component.scss']
})
export class RecentBloodRequestsComponent implements OnInit {

  bloodReqPosts:BloodRequestPost[] = [];
  constructor(private bloodReqService: BloodRequestsServiceService,public dialog: MatDialog,public authService: AuthService) { }

  ngOnInit() {
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

}

