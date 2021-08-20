import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, from, of } from 'rxjs';
import { User } from './user.model';
import {map, switchMap, tap} from 'rxjs/operators';
import { IonicStorageService } from '../Services/ionic-storage.service';
import { VariableManagementService } from '../Services/variable-management.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { MqttInterfaceService } from '../Services/mqtt-interface.service';

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

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(map(user =>{
      if(user){
        return !!user.token; //Two exclamation marks are added to convert the token to boolean.
      }
      else {
        return false;
      }
    })); 
  }
  
  get userId() {
    return this._user.asObservable().pipe(map(user => {
      if(user)
      { user.id}
    else return null;}));
  }

  constructor(private http: HttpClient, private storageService: IonicStorageService, private variableManagementService: VariableManagementService, private fireStore: AngularFirestore, private mqttService: MqttInterfaceService) { }

  signup( email: string, password: string, confirmpassword: string){
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseConfig.apiKey}`,
    {email: email, password: password, confirmpassword: confirmpassword, returnSecureToken: true }).pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) { 
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseConfig.apiKey}`,
      { email: email, password: password, returnSecureToken: true }
    ).pipe(tap(this.setUserData.bind(this)));
  }

  fetchServerIPs(userId: string) {
    return this.fireStore.collection('userData').doc(userId).valueChanges().pipe(switchMap((userData: any) => {
      if (userData) {
        this.storageService.set("serverAddresses", userData);
        this.variableManagementService.setRESTServerURL(userData['restServer']);
        return this.variableManagementService.fetchDevices().pipe(tap(() => {
          let mqttHost = userData['mqttBroker'];
          let topics: string[] = [];
          this.mqttService.createClient(topics, { host: mqttHost, port: 8000 });
        }, (error: any) => {
          console.log(error);
        }));
      } else {
        console.log("This account does not have backend servers setup");
        return of(false);
      }
    })); 
  }

  fetchServerIPsFromLocalStorage() {
    return this.storageService.get('serverAddresses').pipe(switchMap(data => {
      if(data) {
        this.variableManagementService.setRESTServerURL(data['restServer']);
        return this.variableManagementService.fetchDevices().pipe(tap(() => {
          let mqttHost = data['mqttBroker'];
          let topics: string[] = [];
          this.mqttService.createClient(topics, { host: mqttHost, port: 8000 });
        }, (error: any) => {
          console.log(error);
        }));
      } else {
        return of(false);
      }
    }));
  }

  autoLogin() {
    return from(this.storageService.get('authData')).pipe(map(storedData => {
      console.log(storedData);
      if (!storedData) {
        console.log("value not found");
        return null;
      }
      const expirationTime = new Date(storedData.tokenExpirationDate);
      if (expirationTime <= new Date()) {
        console.log("expired");
        return null;
      }
      const user = new User(storedData.localId, storedData.email, storedData.idToken, expirationTime);
      return user;
    }),
    tap(user => {
      console.log(user);
      if (user) {
        this._user.next(user);
      }
    }),
    switchMap(user => {
      if(user) {
        return this.fetchServerIPsFromLocalStorage().pipe(switchMap(isSuccessful => {
          if(!isSuccessful) {
            return this.fetchServerIPs(user.id).pipe(switchMap(() => {
              return of(true);
            }))
          } else {
            return of(true);
          }
        }))
      } else {
        return of(false);
      } 
    }));
  }

logout(){
  this._user.next(null); 
  this.storageService.clear();
}

  private setUserData(userData: AuthResponseData) {
    //Date object that marks the expiration of the token.
    console.log(userData);
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000 //Conversion to seconds.
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
    this.storeAuthData(userData.localId, userData.idToken, userData.email, expirationTime.toISOString());
    console.log(this._user.value)
  }

  private storeAuthData(localId: string, idToken: string, email: string, tokenExpirationDate: string) {
    this.storageService.set('authData', { localId: localId, idToken: idToken, email: email, tokenExpirationDate: tokenExpirationDate });
  }
}
