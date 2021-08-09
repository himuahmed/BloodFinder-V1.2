
import { Component, OnInit, ViewChild, HostListener, ElementRef  } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Title } from '@angular/platform-browser';
import { forEach as _forEach, cloneDeep as _cloneDeep } from 'lodash';
import { Person } from '../app-person/interfaces/person';
import { GlobalMessage } from '../global-interfaces/globalMessage';
import { GlobalChatServiceService } from '../shared-services/global-chatService.service';
import { UserServiceService } from '../shared-services/user-service.service';

@HostListener('scroll', ['$event'])
@Component({
  selector: 'app-global-chat',
  templateUrl: './global-chat.component.html',
  styleUrls: ['./global-chat.component.scss']
})
export class GlobalChatComponent implements OnInit {

  @ViewChild('globalChatScrollBar') chatScrollBar: ElementRef;


  constructor(private chatService: GlobalChatServiceService, private userService:UserServiceService,private readonly titleService: Title) {
    this.titleService.setTitle('Blood Donors')
   }

  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  diameter = 60;
 

  msgDto: GlobalMessage = new GlobalMessage();
  msgInboxArray =  [];
  isLoggedIn = false;
  currentUser: Person
  currentUserId = '';
  pageNumber = 1;
  failedToLoadMessage = false;
  isLoading = true;
  
  ngOnInit() {
    this.chatService.retrieveMappedObject().subscribe( (receivedObj: GlobalMessage) => { this.addToInbox(receivedObj);});  // calls the service method to get the new messages sent
    this.userService.getCurrentUser().subscribe(res=>
      {
        this.currentUser = res;
        this.currentUserId = this.currentUser.userId;
        this.isLoggedIn = true;
      });
    this.getGlobalMessages();
  }
  onScroll(event: any){
    if ( this.chatScrollBar.nativeElement.scrollTop === 0) {
      console.log("End");
      this.pageNumber = this.pageNumber+1;
      this.getGlobalMessages(this.pageNumber);
      
    }
  }

  getGlobalMessages(pageNumber?:number, pageSize?:number){
    pageNumber = this.pageNumber;
    pageSize = 50;
    this.chatService.getGlobalMessages(pageNumber, pageSize).subscribe(res=>{
      this.isLoading = false;
      if(res.result != null){
        let msgArray = this.msgInboxArray;
        _forEach(res.result, function(msg){
          msgArray.unshift(msg);
        })
        this.msgInboxArray = msgArray;
      }
    },error=>{
     this.failedToLoadMessage = true;
     this.isLoading = false;
    })
  }

  send(): void {
    this.msgDto.user = this.currentUser.fullName;
    this.msgDto.userId = this.currentUser.userId;
    debugger
    if(this.msgDto) {
      if(this.msgDto.message.length == 0){
        window.alert("Both fields are required.");
        return;
      } else {
        this.chatService.broadcastMessage(this.msgDto);
       //this.resetMsgBox()                   // Send the message via a service
      }
    }
  }

  addToInbox(obj: GlobalMessage) {
    debugger
    let newObj = obj.user;
    this.msgInboxArray.push(newObj);
    this.resetMsgBox();
  }

  resetMsgBox(){
    this.msgDto.message = "";
  }

}