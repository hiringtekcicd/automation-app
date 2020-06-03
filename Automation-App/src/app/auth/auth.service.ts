import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import {map, tap} from 'rxjs/operators';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;   //Optional because this property is used only for Login.
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private _user = new BehaviorSubject<User>(null); //Initialized with null.

    get userIsAuthenticated() //Used to not accidentally overwrite the property from elsewhere.
    {
      //Pipe is used to return only if the user is authenticated or not.
      return this._user.asObservable().pipe(map(user =>{
        if(user){
          return !!user.token;
        }
        else return false;})); //Two exclamation marks are added to convert the token to boolean.
    }
    get userId() {
      return this._user.asObservable().pipe(map(user => {
        if(user)
       { user.id}
      else return null;}));
    }
  constructor(private http: HttpClient) { }
  signup( email: string, password: string, confirmpassword: string){
    
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
    {email: email, password: password, confirmpassword: confirmpassword, returnSecureToken: true }).pipe(tap(this.setUserData.bind(this)));
}

  login(email: string, password: string){ 
    return this.http.post<AuthResponseData>(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${
        environment.firebaseAPIKey
      }`,
      { email: email, password: password }
    ).pipe(tap(this.setUserData.bind(this)));;
  // logout(){
  //   this._userIsAuthenticated = false;  
  // }
}
private setUserData(userData: AuthResponseData) {
  //Date object that marks the expiration of the token.
  const expirationTime = new Date(
    new Date().getTime() //Current time in milliseconds.
    + +userData.expiresIn * 1000 //Conversion to seconds.
  );
  this._user.next(
    //Creating a new user and retrieving the user data.
    new User(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime
    )
  );
}}
