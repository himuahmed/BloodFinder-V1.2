import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrivateMessage } from 'src/app/global-interfaces/private-message';
import { PrivateChatServiceService } from 'src/app/shared-services/private-ChatService.service';

@Component({
  selector: 'app-send-message-dialog',
  templateUrl: './send-message-dialog.component.html',
  styleUrls: ['./send-message-dialog.component.scss']
})
export class SendMessageDialogComponent implements OnInit {
  closeDialog = false;
  message:PrivateMessage = new PrivateMessage();
  constructor(@Inject(MAT_DIALOG_DATA) public data: {userId: string, name:string}, private http:HttpClient, private privateChatService: PrivateChatServiceService) { }

  ngOnInit() {
  }

  sendMessage(){
    this.message.Receiver = this.data.userId;
    this.privateChatService.sendMessage(this.message);
    debugger
    this.closeDialog = true;
  }
}
