import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  isLogin: any = false;
  constructor(private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    this.isLogin = localStorage.getItem('isLogin') == 'true' ? true : false;
    let authInfo = {
      authenticated: this.isLogin
    };
    console.log("$$$$$$$$$$$$$$", authInfo.authenticated)
    if (!authInfo.authenticated) {
      this.router.navigate([""]);
      return false;
    }

    return true;
  }
}