import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private _userIsAuthenticated = false; //set to false as a default.

    get userIsAuthenticated() //Used to not accidentally overwrite the property from elsewhere.
    {
      return this._userIsAuthenticated; 
    }
  constructor() { }
  signup(){
    this._userIsAuthenticated = true;
}

  login(){ 
    this._userIsAuthenticated = true;  //Authenticates user and allows login when called.
  }
  logout(){
    this._userIsAuthenticated = false;  //This method sets user authentication back to false when called.
  }
}
