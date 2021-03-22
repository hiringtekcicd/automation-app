import { Component, OnInit } from '@angular/core';
import { AuthService, AuthResponseData } from './auth.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms'; //Imported to track the value and validation status of an individual form control.
import { LoadingController, AlertController, MenuController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { PasswordStrengthValidator } from './password';
import { VariableManagementService, Devices } from '../Services/variable-management.service';
import { MqttInterfaceService } from '../Services/mqtt-interface.service';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable, of } from "rxjs";


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  formgroup: FormGroup;

  isLoading = false; //set to false as a default.
  isLogin = true; //set to true as a default.
  //Parameters injected to trigger the necessary methods.
  constructor(private authService: AuthService, private mqttService: MqttInterfaceService, private router: Router, private loadingCtrl: LoadingController,
    public formbuilder: FormBuilder, private alertCtrl: AlertController, private variableManagementService: VariableManagementService,
    private menu: MenuController,
    private http: HttpClient,
    private afs: AngularFirestore) {
    this.formgroup = this.formbuilder.group(
      {
        email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
        password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), PasswordStrengthValidator.isValid]))
      }
    );

  }
  ionViewDidEnter() {
    localStorage.setItem("isLogin", 'false')
    this.menu.enable(false);
  }

  ngOnInit() { }

  onSubmit() {
    if (!this.formgroup.valid) {
      return;
    }
    //If the form is valid, the email and password properties are extracted.
    const email = this.formgroup.value['email'];
    const password = this.formgroup.value['password'];
    this.onLogin(email, password);
  }
  onLogin(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        //To fetch the AuthResponseData asynchronously, Observable is used here.
        let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {

          authObs = this.authService.login(email, password);
        }
        //Data is fetched when subscriber function is executed.
        authObs.subscribe((resData: any) => {
          console.log(resData);
          this.isLoading = false;
          loadingEl.dismiss();
          console.log('Logged in!');
          this.variableManagementService.fetchDevices().subscribe(() => {
            let mqttHost = "broker.hivemq.com";
            let topics: string[] = [];
            this.mqttService.createClient(topics, { host: mqttHost, port: 8000 });
            this.menu.enable(true);
            // { userid: resData.userid }
            // this.http.get<AuthResponseData>(`https://firestore.googleapis.com/v1/hydroteck/hydrotek-286213/dato/usersetting?key=${environment.firebaseAPIKey}&userid=` + resData.localId,
            // ).subscribe(resData1 => {
            //   console.log(resData1)
            // })

            let user_settting = this.getUserSetting(resData);
            // user_settting.subscribe((setting: any) => {
            //   console.log("$$$$$$$$$$$$$$$$$$$$$$", setting)
            // })
            localStorage.setItem('isLogin', 'true');
            this.router.navigateByUrl('/dashboard/monitoring');
          }, (error: any) => {
            console.log(error);
          });
        },
          //In case of errors while logging in, custom error messages are displayed.
          errRes => {
            loadingEl.dismiss();
            console.log(errRes);
            const code = errRes.error.error.message;
            let message = 'Could not log you in. Try again.';
            if (code === 'EMAIL_NOT_FOUND') {
              message = 'E-Mail address could not be found.';
            } else if (code === 'INVALID_PASSWORD') {
              message = 'This password is not correct.';
            }
            this.showAlert(message);
          }
        );
      });
  }

  private getUserSetting(user: any) {
    console.log("user................", user)
    console.log("userid................", user.localId)

    // key : GM5XvPFoUbc2JRFjbrpiOXKqGws1
    return this.afs.collection("usersettings", (ref) =>
      ref.where("userid", "==", user.localId)).get().subscribe(data => {
        if (data) {
          data.forEach(data => {
            console.log("@@@@@@@@@@@@@@@@@", data.data())
            return data.data()
          })
        }
      })
  }
  //Alert box display function.
  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

  //Navigated to the Signup Page when Sign Up option is selected.
  signUp() {
    this.router.navigateByUrl('/register')
  }
}



