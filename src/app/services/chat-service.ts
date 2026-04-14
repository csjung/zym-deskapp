import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { io, Socket } from 'socket.io-client';
import { Http } from './http';
import { Common } from './common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  private socket: Socket = io(environment.socketUrl);

  constructor(
    private http: Http,
    private common: Common,
  ) {
  }

  joinRoom(roomId: string | undefined): void {
    let room:any = {};
    room.id = roomId;
    let user = this.common.getMember();
    room.joinId = user.id;
    this.socket.emit('joinRoom', room);
  }

  leaveRoom(roomId: string | undefined): void {
    let room:any = {};
    room.id = roomId;
    let user = this.common.getMember();
    room.leaveId = user.id;
    this.socket.emit('leaveRoom', room);
  }

  sendMessage(chat:any): Observable<any> {      
    return this.http.postObject(chat, '/chat/sendMessage.do');
  }

  sendSocketMessage(data: any | undefined): void {
    this.socket.emit('message', data);
  }
  

  getMessages(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('message', (message) => {
        observer.next(message);
      });
    });
  }


  gechatList(param:any) {
    return this.http.postObject(param, '/chat/getAllParamPage.do');
  }

  sendMessageFile(roomId: string | undefined, message: string, fileId: string): Observable<any> {
    let chat:any = {};
    chat.roomId = roomId;
    chat.message = message;
    chat.msgType = 'FILE';
    chat.fileInfoId = fileId;
    let user = this.common.getMember();
    chat.writerId = user.id;    
    return this.http.postObject(chat, '/chat/sendMessage.do');
  }
}
