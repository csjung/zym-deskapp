import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Http } from '../../services/http';
import { Common } from '../../services/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChatRoomService } from '../../services/chat-room-service';
import { MatIconModule } from '@angular/material/icon';
import { ChatItem } from '../chat-item/chat-item';

@Component({
  selector: 'app-chat-list',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatIconModule,
    ChatItem,
  ],
  templateUrl: './chat-list.html',
  styleUrl: './chat-list.scss',
})
export class ChatList {

  memberList = signal([] as any[]);
  filter:string = '';
  user:any = {};

  constructor(
    private http: Http,
    private common: Common,
    private chatRoomService: ChatRoomService,
  ) {

    this.user = this.common.getMember();
  }

  ngOnInit(): void {  
    this.setMemberList();
  }

  setMemberList() {
    let user = this.common.getMember();
    let param:any = {};
    param.memberName = this.filter;
    param.franchisesId = user.franchisesId;
    this.http.postList(param, '/chatMember/getAllChatMember.do').subscribe((data) => {
      this.memberList.set(data.filter(item => (item.id != this.user.id)));
    });
  }

  get chatRoomList() {
    return this.chatRoomService.DataSignal;
  }


  openChatRoomPrivate(item:any) {
   
    // const popup = window.open(
    //   '/#/group-chat-room/' + this.user.id + '/' + item.id, // 여기에 원하는 URL을 넣으세요
    //   item.id,
    //   `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
    // );

    // if (popup) {
    //   popup.onresize = () => {        
    //     if (popup.innerWidth < popupWidth) {
    //       popup.resizeTo(popupWidth, popupHeight);
    //     }
    //   };
    // }

  }

  openChatRoom(item:any) {
    // item.chatRoom.active = true;
    // const popupWidth = 410;
    // const popupHeight = 690;
    // const left = (screen.width / 2) - (popupWidth / 2);
    // const top = (screen.height / 2) - (popupHeight / 2);

    // const popup = window.open(
    //   '/#/group-chat-room/' + item.chatRoom.id, // 여기에 원하는 URL을 넣으세요
    //   item.chatRoom.id,
    //   `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
    // );

    // if (popup) {
    //   popup.onresize = () => {        
    //     if (popup.innerWidth < popupWidth) {
    //       popup.resizeTo(popupWidth, popupHeight);
    //     }
    //   };
    // }
  }

}
