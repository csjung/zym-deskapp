import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { Common } from '../services/common';
import { Http } from '../services/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { filter } from 'rxjs';

declare var window: Window & { webkit: any };

interface WebAppInterface {
  getFirebaseToken(): any;
}

declare let aScript: WebAppInterface;

@Component({
  selector: 'app-pages',
  imports: [
      RouterOutlet,
      CommonModule,
      RouterModule,
      FlexLayoutModule,
  ],
  templateUrl: './pages.html',
  styleUrl: './pages.scss',
})
export class Pages {

  user:any;

  routerUrl = '';
  numbers = Array.from({ length: 10 }, (_, i) => i + 1);
  constructor(
    private router: Router,
    private common: Common,
    private http: Http,
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      console.log('event.url', event.url);
      this.routerUrl = event.url;
    });
    this.user = common.getMember();
  }

  ngOnInit() {

    try {
      if (aScript) { 
        let token = aScript.getFirebaseToken(); 
        let user = this.common.getMember()
        user.appToken = token;
        this.http.postObject(user, '/member/saveAppToken.do').subscribe(obj => {
        });
      }
    } catch (error) {
    }

    try {
      let that = this;
      window.webkit.resolveFirebaseToken = function(token:any) {        
        let user = that.common.getMember();
        user.appToken = token;
        that.http.postObject(user, '/member/saveAppToken.do').subscribe();
      }  
      window.webkit.messageHandlers.getFirebaseToken.postMessage('h');
    } catch(err) {
      console.log(err);
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      window.scrollTo(0, 0); 
      document.body.scrollTop = 0;
      this.routerUrl = event.url;
    });
  }
}
