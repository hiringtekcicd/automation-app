import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
interface AuthResponseData //Describes how the data we get back will look like.
 {
  kind: string; 
  idToken : string; 
  email: string;
  refreshToken: string; //Allows us to refresh the token which expires by default in 1 hr.
  localId: string; //User Id created by firebase.
  expiresIn: string; //how long the IdToken will be valid.
  registered?: boolean //optional field for signup
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private _userIsAuthenticated = false; //set to false as a default.
  private _userId = null;

  get userIsAuthenticated() //Used to not accidentally overwrite the property from elsewhere.
  {
    return this._userIsAuthenticated; 
  }
constructor(private http: HttpClient) { }
signup( email: string, password: string, confirmpassword: string){
  // this._userIsAuthenticated = true;
  return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${environment.firebaseAPIKey}`,
  {email: email, password: password, confirmpassword: confirmpassword, returnSecureToken: true });
}

login(){ 
  this._userIsAuthenticated = true;  //Authenticates user and allows login when called.
}
logout(){
  this._userIsAuthenticated = false;  //This method sets user authentication back to false when called.
}
}


