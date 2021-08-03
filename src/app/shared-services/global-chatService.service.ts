import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as signalR from '@microsoft/signalr';  
import { GlobalMessage } from '../global-interfaces/globalMessage';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResult } from '../global-interfaces/pagination';
import { map } from 'rxjs/operators';
import { IHttpConnectionOptions } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class GlobalChatServiceService {
  readonly POST_URL = environment.apiUrl + "message/send";
  readonly FetchGlobalMessage_Url = environment.apiUrl + "message/GetGlobalMessage";
   jwtToken = '?token=' + localStorage.getItem('token');

/*   options: IHttpConnectionOptions = {
    accessTokenFactory: () => {
      return localStorage.getItem('token');
    }
  }; */

  private  connection: any = new signalR.HubConnectionBuilder().withUrl("https://localhost:44322/MessageHub"+ this.jwtToken)   // mapping to the chathub as in startup.cs
  .configureLogging(signalR.LogLevel.Information)
  .build();

  private receivedMessageObject: GlobalMessage = new GlobalMessage();
  private sharedObj = new Subject<GlobalMessage>();

  constructor(private http:HttpClient) { 
    this.connection.onclose(async () => {
      await this.start();
    });
   this.connection.on("globalMessageReceived", (message) => {
      this.mapReceivedMessage(message); 
    });
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

    private mapReceivedMessage(message: string): void {
      this.receivedMessageObject.user = message;
      //this.receivedMessageObject.message = message;
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

  getGlobalMessages(pageNumber?:number, pageSize?:number): Observable<PaginatedResult<GlobalMessage[]>>{
    const paginatedResult: PaginatedResult<GlobalMessage[]> = new PaginatedResult<GlobalMessage[]>();
    let params = new HttpParams();

    if(pageNumber != null && pageSize != null){
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }
    return this.http.get<GlobalMessage[]>(this.FetchGlobalMessage_Url, {observe: 'response', params}).pipe(
      map(response=>{
        paginatedResult.result = response.body;
        if(response.headers.get('paginationheaders') != null){
          paginatedResult.pagination = JSON.parse(response.headers.get('paginationheaders'));
        }
        return paginatedResult;
      })
    )
  }
  

}
