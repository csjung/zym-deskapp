import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Common } from '../../services/common';
import { Http } from '../../services/http';

@Component({
  selector: 'app-auto-order',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatIconModule,
  ],
  templateUrl: './auto-order.html',
  styleUrl: './auto-order.scss',
})
export class AutoOrder {

  orderTxt = '';

  private common = inject(Common);
  private http = inject(Http);
  user = this.common.getMember();

  aiSession:any = {};

  constructor(
  ) {
    let obj:any = {};
    obj.memberId = this.user.id;
    this.http.postList(obj, '/aiSession/getMyAiSession.do').subscribe((data) => {
      this.aiSession = data;       
    });
  }

  order(inout:any) {   
    if (!this.orderTxt) {
      alert('오더생성 내용을 입력 해 주세요.');
      return;
    } 
    let obj:any = {};
    obj.memberId = this.user.id;
    obj.franchisesId = this.user.franchisesId;
    obj.aiSessionId = this.aiSession.id;
    obj.txt = this.orderTxt;
    this.http.postObject(obj, inout).subscribe((data) => {
      this.orderTxt = '';
      alert('1분 정도 후 화물등록 화면에서 생성된 오더를 확인 가능합니다.')
    });
  }

}
