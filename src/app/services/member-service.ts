import { Injectable } from '@angular/core';
import { Http } from './http';
import { Common } from './common';

@Injectable({
  providedIn: 'root',
})
export class MemberService {

  constructor(
    private http: Http,
    private common: Common,
  ) {
  }

  getMember(id:any) {
    return this.http.getObject('/chatMember/getChatMember.do/' + id);
  }

  getMemberList(param:any) {
    return this.http.postObject(param, '/member/getAllParam.do');
  }
}
