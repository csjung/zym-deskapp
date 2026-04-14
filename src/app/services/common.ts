import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Common {
  key = "iscargo!0516246120";

  constructor() { }  

  public setMember(item: any) {
    this.setSessionItem("member", item);
  }

  public getMember(): any {
    return this.getSessionItem("member");
  }

  public setSessionItem(key: string, item: any) {
    let itemStr = JSON.stringify(item);
    itemStr = this.encrypt(itemStr);
    sessionStorage.setItem(key, itemStr);
  }

  public getSessionItem(key: string) {
    let itemStr = sessionStorage.getItem(key);
    let item = null;
    if(itemStr) {
        item = JSON.parse(this.decrypt(itemStr));
    }
    return item;
  }

  public setLocalItem(key: string, item: any) {
    let itemStr = JSON.stringify(item);
    itemStr = this.encrypt(itemStr);
    localStorage.setItem(key, itemStr);
  }

  public getLocalItem(key: string) {
    let itemStr = localStorage.getItem(key);
    let item = null;
    if(itemStr) {
        item = JSON.parse(this.decrypt(itemStr));
    }
    return item;
  }

  public encrypt(password: string): string {
    //return CryptoJS.AES.encrypt(password, this.key).toString();
    return password;
  }

  public decrypt(passwordToDecrypt: string) {
    //return CryptoJS.AES.decrypt(passwordToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
    return passwordToDecrypt;
  }
}
