import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnection } from '@microsoft/signalr';
import { Observable, Subject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/services/auth.service';
import { GlobalMessage } from '../global-interfaces/globalMessage';
import { OnlineUser } from '../global-interfaces/OnlineUser';
import { UserServiceService } from './user-service.service';
import { PrivateMessage } from '../global-interfaces/private-message';
import { PaginatedResult } from '../global-interfaces/pagination';
import { map } from 'rxjs/operators';
import { ChatLists } from '../global-interfaces/ChatLists';
import { reverse } from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class PrivateChatServiceService {

    jwtToken ="?token="+ localStorage.getItem('token');
    connectionId:string;
    POST_URL = environment.apiUrl + "message/sendDM";
    url = environment.apiUrl;

    private receivedMessageObject: PrivateMessage = new PrivateMessage();
    private sharedObj = new Subject<PrivateMessage>();

    private hubConnection: any = new signalR.HubConnectionBuilder().withUrl("https://localhost:44322/PrivateMessageHub"+ this.jwtToken)
      .configureLogging(signalR.LogLevel.Information)
      .build();


    constructor(private http: HttpClient, private authService: AuthService) {
      this.hubConnection.onclose(async () => {
         this.start();
      });
      this.hubConnection.on("SendDM", (message) => {
        this.mapReceivedMessage(message); 
      });
      this.start();
    }

    private mapReceivedMessage(message: string): void {
      this.receivedMessageObject.Message = message;
      //this.receivedMessageObject.message = message;
      this.sharedObj.next(this.receivedMessageObject);
   }

   public retrieveMappedObject(): Observable<PrivateMessage> {
    return this.sharedObj.asObservable();
  }



    joinInvoke(){
      this.hubConnection.invoke("Join");
    }

    LeaveInvoke(){
      this.hubConnection.invoke("Leave");
    }


    public async start(){
      await this.hubConnection.start().then(() => {
        //this.getConnectionId()
        //this.hubConnection.invoke("Join");
        
      })
      .catch((err) => console.log('error while establishing signalr connection: ' + err));
      await this.joinRoom();
      await this.connectedUsers();
      await this.joined();
      this.msgHub();
      this.userLeft();
    }

  /*   getConnectionId(){
      this.hubConnection.on("getConnectionId",(cId)=>{
        this.connectionId = cId;
        console.log("Conection Id isssssssss: " + this.connectionId);
      })
    } */

    sendMessage(message:PrivateMessage){
      return this.hubConnection.invoke('SendDirectMessage', message)
    }

   /*  sendMessage(message:PrivateMessage){
      return this.http.post(this.url+'message/sendPM', message);
    } */

    msgHub(){
      this.hubConnection.on('SendDM', (message:any)=>{
        console.log(message);
      });
    }

    joinRoom(){
      this.hubConnection.on('NewOnlineUser',(onlineUser: OnlineUser)=>{
        console.log("User Joined room : ");
        console.log(onlineUser);
      })
    }

    async joined(){
      this.hubConnection.on('Joined',(onlineUser: OnlineUser)=>{
        console.log("Joined user : "+ onlineUser);
      })
    }

    userLeft(){
      this.hubConnection.on('UserLeft',(userName: string)=>{
        console.log("Left user : "+ userName);
      })
    }

    connectedUsers(){
      this.hubConnection.on('OnlineUsers',(onlineUser: OnlineUser[])=>{
        console.log("User lists ");
        console.log(onlineUser);
      })
    }

/* 
    getMessages(){
      return this.http.get(this.url);
    } */

    getMessages(receiverId:string,pageNumber?:number, pageSize?:number): Observable<PaginatedResult<PrivateMessage[]>>{
      const messages: PaginatedResult<PrivateMessage[]> = new PaginatedResult<PrivateMessage[]>();
      let params = new HttpParams();
  
      if(pageNumber != null && pageSize != null){
        params = params.append('pageNumber', pageNumber);
        params = params.append('pageSize', pageSize);
      }
      return this.http.get<PrivateMessage[]>(this.url+'message/GetPrivateMessages/'+receiverId,{observe: 'response', params}).pipe(
        map(response=>{
          messages.result = response.body;
          if(response.headers.get('paginationheaders') != null){
            messages.pagination = JSON.parse(response.headers.get('paginationheaders'));
          }
          return messages;
        })
      )
    }

    getChatList(){
      return this.http.get<ChatLists>(this.url+'message/GetChatList');
    }



}
