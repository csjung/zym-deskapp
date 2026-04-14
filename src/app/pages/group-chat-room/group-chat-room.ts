import { Component, ElementRef, Renderer2, signal, ViewChild } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChatDatePipe } from '../../common/chat-date-pipe';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Http } from '../../services/http';
import { Common } from '../../services/common';
import { ChatService } from '../../services/chat-service';
import { ChatRoomService } from '../../services/chat-room-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { MemberService } from '../../services/member-service';

@Component({
  selector: 'app-group-chat-room',
  imports: [
    FormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    ChatDatePipe
  ],  
  templateUrl: './group-chat-room.html',
  styleUrl: './group-chat-room.scss',
})
export class GroupChatRoom {
  
  chatRoom?:any;
  chatList = signal([] as any[]);

  // get chatListData() {
  //   return this.chatList();
  // }

  roomId:string | undefined = '';
  pageIndex = 0;
  message = '';
  user:any = {};
  scrollHeight = 500;
  DOWN_URL = environment.serviceUrl + '/fileInfo/downloadFile.do/';
  loading = signal(false);
  // get loadingData() {
  //   return this.loading();;
  // }
   
  @ViewChild('chatBody') chatBody?: ElementRef | undefined;

  bodyHeight: number = 490;

  text = '';
  isDragging = false;
  selectedFiles: File[] = [];
  sending = false;
  targetName = signal('');
  get targetNameData() {
    return this.targetName();;
  }
  
  constructor(        
    private route: ActivatedRoute,
    private router: Router,
    private http: Http,
    private common: Common,
    private chatService: ChatService,
    private chatRoomService: ChatRoomService,
    private snackBar: MatSnackBar,
    private httpClient: HttpClient,
    private memberService: MemberService,
  ) {
    this.user = this.common.getMember();
    this.chatService.getMessages().subscribe((chat: any) => {      
      if (chat.joinId && this.user.id != chat.joinId) {
        this.memberService.getMember(chat.joinId).subscribe((member) => {
          this.snackBar.open(member.memberName + "이 입장 하셨습니다.", 'INFO', {
            duration: 3000,
          });  
        }); 
      } else if (chat.leaveId && this.user.id != chat.leaveId) {  
        this.memberService.getMember(chat.leaveId).subscribe((member) => {
          this.snackBar.open(member.memberName + "이 퇴장 하셨습니다.", 'INFO', {
            duration: 3000,
          });  
        }); 
      } else {        
        if (this.user.id != chat.writerId) {
          this.chatList().push(chat);          
        }
      }
    });
  }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    let to = this.route.snapshot.paramMap.get('to');
    if (id && to) {
      this.chatRoomService.getChatRoom2(id, to).subscribe((data) => {
        this.chatRoom = data;
        this.roomId = this.chatRoom.id; 
        this.chatService.joinRoom(this.roomId);
        this.searchChatList(); 
        if(this.chatRoom?.targetId) {
          if (this.chatRoom?.createId == this.user?.id) {
            this.memberService.getMember(this.chatRoom?.targetId).subscribe((chatMember) => {
              if (chatMember)  this.targetName.set(chatMember.memberName);
            });
          } else {
            this.memberService.getMember(this.chatRoom?.createId).subscribe((chatMember) => {
              if (chatMember)  this.targetName.set(chatMember.memberName);
            });
          }          
        }
      }); 
      
    } else if (id) {
      this.roomId = this.route.snapshot.paramMap.get('id')?.toString();
      this.chatRoomService.getChatRoom(this.roomId).subscribe((data) => {
        this.chatRoom = data; 
        if(this.chatRoom?.targetId) {
          if (this.chatRoom?.createId == this.user?.id) {
            this.memberService.getMember(this.chatRoom?.targetId).subscribe((chatMember) => {
              if (chatMember)  this.targetName.set(chatMember.memberName);
            });
          } else {
            this.memberService.getMember(this.chatRoom?.createId).subscribe((chatMember) => {
              if (chatMember)  this.targetName.set(chatMember.memberName);
            });
          }
        }
      }); 
      this.chatService.joinRoom(this.roomId);      
      this.searchChatList(); 
      
        
    }    
  }

  bottom() {    
    let d = document.querySelector('.chat-body');
    if(d) {
      d.scrollTop = d.scrollHeight;
    }
  }

  searchChatList() {
    let param:any = {};
    param.roomId = this.roomId;
    param.pageIndex = this.pageIndex;
    param.pageSize = 10;
    this.chatService.gechatList(param).subscribe((data) => {
      const list:any[] = data.content; 
      list.reverse();
      this.chatList.set(list);
      
    }); 
  }

  onEnterPressed(event: any) {
    // 이벤트 전파 방지
    event.preventDefault();
    event.stopPropagation();
    if (this.message) {
      let chat:any = {};
      chat.roomId = this.roomId;
      chat.message = this.message;
      let user = this.common.getMember();
      chat.writerId = user.id;        
      this.chatList().push(chat);
      this.chatService.sendMessage(chat).subscribe((data) => {
        setTimeout(() => {
          this.bottom();
        }, 500);
        let member:any = {};
        member.memberName = this.user.carNum;
        data.member = member;
        this.chatService.sendSocketMessage(data);
      }); 
      this.message = '';      
    }
    
  }  
  
  isImage(mimeType: string): boolean {
    return mimeType?.startsWith('image/');
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.sendFiles(input.files);
    input.value = '';
  }

  sendFiles(files: FileList) {
    this.loading.set(true);
    const incoming = Array.from(files);
    for (const file of incoming) {
      const exists = this.selectedFiles.some(f => f.name === file.name && f.size === file.size);
      if (!exists) {
          this.selectedFiles.push(file);
      }
    }
    const formData = new FormData();
    this.selectedFiles.forEach(file => formData.append('files', file));
    this.httpClient.post<any[]>(`${environment.serviceUrl}/chat/fileUpload.do`, formData).subscribe(uploadedFiles => {
      console.log('uploadedFiles', uploadedFiles);
      uploadedFiles.forEach(element => {
        this.chatService.sendMessageFile(this.roomId, element.logFileName, element.id).subscribe((data) => {
          this.chatList().push(data);
          this.loading.set(false);   
          setTimeout(() => {
            this.bottom();
          }, 500);
          this.chatService.sendSocketMessage(data);
        }); 
      }); 
    });
  }

  onScroll(event: Event) {
    console.log('this.chatBody?.nativeElement?.scrollTop', this.chatBody?.nativeElement?.scrollTop);
    if (this.chatBody?.nativeElement?.scrollTop == 0) {
      this.pageIndex++;
      console.log('this.pageIndex', this.pageIndex);
      this.searchChatList();
      this.chatBody.nativeElement.scrollTop = 30;
    }
  }

  leave() {
    this.chatService.leaveRoom(this.roomId);
    this.chatRoomService.leaveRoom(this.roomId);
    this.router.navigate(['/']);
  }
  

}
