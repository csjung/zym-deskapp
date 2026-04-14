import { Injectable, signal } from '@angular/core';
import { Http } from './http';
import { Common } from './common';

@Injectable({
  providedIn: 'root',
})
export class ChatRoomService {

  data = signal([] as any[]);
  notRead = signal(0);

  user:any = {};
  constructor(
    private http: Http,
    private common: Common,
  ) {
    this.user = this.common.getMember();
    this.setDataSignal();
  }

  get DataSignal():any[] {
    return this.data();
  }

  get NotRead():any {
    return this.notRead();
  }

  setDataSignal() {
    this.user = this.common.getMember();
    let param:any = {};
    param.memberId = this.user.id;
    this.http.postList(param, '/roomMember/getAllParam.do').subscribe((data) => {
      this.data.set(data); 
      let cnt = 0;
      this.data().forEach(element => {
        cnt = cnt + element.notReadCount;
      });
      this.notRead.set(cnt);
    });
  }

  getChatRoom(id:any) {
    return this.http.getObject('/chatRoom/getOne.do/' + id);
  }

  getChatRoom2(id:any, to:any) {
    return this.http.getObject('/chatRoom/getOne.do/' + id + '/' + to);
  }

  

  // 채팅방 만들기
  createChatRoom(param:any) {
    return this.http.postObject(param, '/chatRoom/createChatRoom.do');
  }

  filterChatRoomList(filter:any) {
    let param:any = {};
    param.memberId = this.user.id;
    param.roomNameLike = filter;
    this.http.postList(param, '/chatRoom/getAllParam.do').subscribe((data) => {
      this.data.set(data); 
      let cnt = 0;
      this.data().forEach(element => {
        cnt = cnt + element.roomMember.notReadCount;
      });
      this.notRead.set(cnt);
    });
  }

  changeChatRoom(chat:any) {
    this.data().forEach(element => {
      if (element.id == chat.roomId && chat.writerId != this.user.id) {
        //이 룸이 활성화 되어 있는지 확인
        if (element.roomMember) {
          element.roomMember.notReadCount++; 
          this.http.postObject(element.roomMember, '/roomMember/updateNotReaCount.do').subscribe((data) => {            
            this.notRead.set(this.notRead() + 1);
          }); 
        }
        element.lastMsg = chat.message;
      }
    });
  }

  openChatRoom(chat:any) {
    let cnt = 0;
    this.data().forEach(element => {
      if (element.id == chat.roomId && chat.writerId == this.user.id) {
        //이 룸이 활성화 되어 있는지 확인
        element.roomMember.notReadCount = 0;
      }
      if (element.roomMember?.notReadCount)  cnt = cnt + element.roomMember.notReadCount;
    });
    this.notRead.set(cnt);
  }

  leaveRoom(roomId: string | undefined): void {
    this.data().forEach(element => {
      if (element.id == roomId) {
        element.active = null;
      }
    });
  }

}
