import { Component, Input, signal } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import {MatBadgeModule} from '@angular/material/badge';
import { Http } from '../../services/http';
import { Common } from '../../services/common';
import { ChatRoomService } from '../../services/chat-room-service';
import { ChatDatePipe } from '../../common/chat-date-pipe';

@Component({
  selector: 'app-chat-item',
  imports: [
    RouterModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    ChatDatePipe,
  ],
  templateUrl: './chat-item.html',
  styleUrl: './chat-item.scss',
})
export class ChatItem {

  @Input() chatRoom: any;
  user;

  roomMemberList:any[] = [];

  oName = signal('');
  get otherName() {
    return this.oName();
  };
 
  constructor(
    private http: Http,
    private common: Common,
    private chatRoomService: ChatRoomService,
  ) {
    this.user = this.common.getMember();
  }

  ngOnInit(): void {    
    let obj:any = {};
    obj.roomId = this.chatRoom.id;
    this.http.postList(obj, '/roomMember/getAllParam.do').subscribe((data) => {
      this.roomMemberList = data;
      if (!this.chatRoom.roomName) {
        data.forEach(element => {
          if (element.memberId != this.user.id) {
           this.oName.set(element.member?.memberName ? element.member?.memberName : element.transMember?.carNum);
          }
        });
      }
    });
  }

}
