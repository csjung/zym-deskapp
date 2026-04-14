import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Common } from './services/common';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private route: ActivatedRoute,
    private router: Router, private common: Common) { 
    this.route.url.subscribe(segments => {
      // segments 배열은 URL의 각 세그먼트 정보를 포함합니다.
      console.log(segments);
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  )  { 
    if (localStorage.getItem("member")) {
      this.common.setSessionItem("member", this.common.getLocalItem("member"));
      return true;
    } else {
      if (sessionStorage.getItem('member')) {          
        return true;
      } else {
        if (state.url.indexOf('login') < 0) {
          this.common.setSessionItem("loginAfter", state.url);
        }
        this.router.navigate(['/login']);
        return false;
      }
    }    
  }
  
};
