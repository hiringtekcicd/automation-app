import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private _userIsAuthenticated = false; //set to false as a default.

    get userIsAuthenticated() //Used to not accidentally overwrite the property from elsewhere.
    {
      return this._userIsAuthenticated; 
    }
  constructor(private http: HttpClient) { }
  signup( email: string, password: string, confirmpassword: string){
    // this._userIsAuthenticated = true;
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${environment.firebaseAPIKey}`,
    {email: email, password: password, confirmpassword: confirmpassword, returnSecureToken: true });
}

  login(){ 
    this._userIsAuthenticated = true;  //Authenticates user and allows login when called.
  }
  logout(){
    this._userIsAuthenticated = false;  //This method sets user authentication back to false when called.
  }
}
