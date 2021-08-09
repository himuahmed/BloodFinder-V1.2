import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PrivateMessage } from '../global-interfaces/private-message';
import { PrivateChatServiceService } from '../shared-services/private-ChatService.service';
import { forEach as _forEach, cloneDeep as _cloneDeep } from 'lodash';
import { UserServiceService } from '../shared-services/user-service.service';
import { Person } from '../app-person/interfaces/person';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-private-ChatComponent',
  templateUrl: './private-ChatComponent.component.html',
  styleUrls: ['./private-ChatComponent.component.scss']
})
export class PrivateChatComponentComponent implements OnInit {
  @ViewChild('globalChatScrollBar') chatScrollBar: ElementRef;
  message:PrivateMessage = new PrivateMessage();
  chatWindowPerson:string;
  //arr = [1,2,3,4,5,6,3,3,2,2,2,2,3,3,23,1,12,2,2,22,2];
  chatListArr = [] ;
  currentUserId = '';
  currentUser:Person;
  isLoggedIn = false;
  messageArray = [];
  pageNumber = 1;
  isMessaging = false;
  messageLodedFirstTime  = false;
  scrollToUpdate = false;
  constructor(private privateChatService: PrivateChatServiceService, private userService:UserServiceService,private authService: AuthService) { }
  ngOnInit() {
    try{
      this,this.getLoggedInUser();
    }
    catch(err){
      setTimeout(()=>this.getLoggedInUser(), 5000);
    }
    this.privateChatService.retrieveMappedObject().subscribe( (receivedObj: PrivateMessage) => { 
      this.addToInbox(receivedObj);
    }); 
    //this.joinRoom();
    this.fetchChatList();
  }

  

  getLoggedInUser(){
    this.userService.getCurrentUser().subscribe(res=>
      {
        this.currentUser = res;
        this.currentUserId = this.currentUser.userId;
        this.isLoggedIn = true;
      });
  }

  onScroll(event: any){
    if ( this.chatScrollBar.nativeElement.scrollTop === 0) {
      console.log("End");
      this.pageNumber = this.pageNumber+1;
      this.fetchMessages(this.chatWindowPerson,this.pageNumber);
    }
  }

  addToInbox(obj: PrivateMessage) {
    let newObj = obj.Message;
    let signature = obj.Message['sender']+ '-' + obj.Message['receiver'];
    let signatureReverse = obj.Message['receiver'] + '-' + obj.Message['sender'];
    if(newObj['signature'] === signature || newObj['signature'] === signatureReverse){
      this.messageArray.push(newObj);
    }
    this.updateChatList(obj);
    console.log(obj);
  }

  updateMessageStatus(receiverId){
    console.log("status updated");
    let msgArray = this.chatListArr;
    _forEach(msgArray, function(msg){
      if(receiverId === msg.personImChattingWith.userId){
        msg.lastMessage.isDelivered = true;
      }
    })
    this.chatListArr = msgArray;
    this.privateChatService.updateMessageStatusInvoke(receiverId);
  }

  msgSeen(){
    this.updateMessageStatus(this.chatWindowPerson);
  }



  joinRoom(){
    this.privateChatService.joinInvoke();
  }

  leaveRoom(){
    this.privateChatService.LeaveInvoke();
  }
 
  sendMessage(){
    this.message.Receiver = this.chatWindowPerson;
    if(this.message.Message != null){
      this.privateChatService.sendMessage(this.message);
    }
    this.message.Message = null;
  }

  resetChatBoxTextField(){
    this.message = new PrivateMessage();
  }
//////// To show messages on chatbox
 async fetchMessages(receiverId, pageNumber?:number){
   
    if(this.chatWindowPerson !== receiverId){
      this.messageArray = [];
      this.messageLodedFirstTime = false;
    }
    if(!this.messageLodedFirstTime || this.scrollToUpdate){
      pageNumber = this.pageNumber;
      this.isMessaging = true;
      this.chatWindowPerson = receiverId;
      this.privateChatService.getMessages(receiverId,pageNumber,50).subscribe(res=>{
        //this.joinRoom();
        if(res.result != null){
          let tempArr = this.messageArray;
          _forEach(res.result, function(msg){
            tempArr.unshift(msg);
          })
          this.messageLodedFirstTime = true;
          this.messageArray = tempArr;
          this.updateMessageStatus(receiverId);
        }
      })
    }
  }


  ///// For the list of person I have chatted with
  fetchChatList(){
    this.privateChatService.getChatList().subscribe(res=>{
      console.log("chatlist");
      console.log(res)
      if(res != null){
        let msgArray = this.chatListArr;
        _forEach(res, function(msg){
          msgArray.push(msg);
        })
        this.chatListArr = msgArray;
      }
    })
  }

/*   newMsgArray = [];

  updateChatWithNewPerson(){
    this.privateChatService.getChatList().subscribe(res=>{
      console.log("chatlist");
      console.log(res)
      if(res != null){
        let msgArray = this.newMsgArray;
        _forEach(res, function(msg){
          msgArray.push(msg);
        })
        this.newMsgArray = msgArray;
      }
    })
  } */

  updateChatList(messageObj:PrivateMessage){
    let signature = messageObj.Message['sender']+ '-' + messageObj.Message['receiver'];
    let signatureReverse = messageObj.Message['receiver'] + '-' + messageObj.Message['sender'];
    if(this.chatListArr != null){
      let tempArr = this.chatListArr;
      _forEach(tempArr, function(msg){
        if(msg.lastMessage.signature === signature || msg.lastMessage.signature === signatureReverse){
          msg.lastMessage = messageObj.Message;
        }
      })
      console.log('replaceddddddddddddddddddddd');
      console.log(tempArr);
    }


  }

  clickCard(message){
    console.log(message);
  }



}
