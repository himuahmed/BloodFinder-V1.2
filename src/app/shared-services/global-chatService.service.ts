import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as signalR from '@microsoft/signalr';  
import { GlobalMessage } from '../global-interfaces/globalMessage';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GlobalChatServiceService {
  readonly POST_URL = environment.apiUrl + "message/send";
  private  connection: any = new signalR.HubConnectionBuilder().withUrl("https://localhost:44322/MessageHub")   // mapping to the chathub as in startup.cs
  .configureLogging(signalR.LogLevel.Information)
  .build();

  private receivedMessageObject: GlobalMessage = new GlobalMessage();
  private sharedObj = new Subject<GlobalMessage>();

  constructor(private http:HttpClient) { 
    this.connection.onclose(async () => {
      await this.start();
    });
   this.connection.on("globalMessageReceived", (user, message) => { this.mapReceivedMessage(user, message); });
   this.start();  
  }

    // Strart the connection
    public async start() {
      try {
        await this.connection.start();
        console.log("connected");
      } catch (err) {
        console.log(err);
        //setTimeout(() => this.start(), 5000);
      } 
    }

    private mapReceivedMessage(user: string, message: string): void {
      this.receivedMessageObject.user = user;
      this.receivedMessageObject.message = message;
      this.sharedObj.next(this.receivedMessageObject);
   }

     // Calls the controller method
  public broadcastMessage(msgDto: any) {
    this.http.post(this.POST_URL, msgDto).subscribe();
    // this.connection.invoke("SendMessage1", msgDto.user, msgDto.msgText).catch(err => console.error(err));    // This can invoke the server method named as "SendMethod1" directly.
  }

  public retrieveMappedObject(): Observable<GlobalMessage> {
    return this.sharedObj.asObservable();
  }

}
