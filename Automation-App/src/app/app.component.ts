import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

import { MenuController, ModalController, Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { VariableManagementService } from './Services/variable-management.service';
import { IdentifyDevicePage } from './add-device/identify-device/identify-device.page';
import { Subscription } from 'rxjs';
import { AddFertigationSystemPage } from './add-fertigation-system/add-fertigation-system.page';
import { AddClimateControllerPage } from './add-climate-controller/add-climate-controller.page';
import { MqttInterfaceService } from './Services/mqtt-interface.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private authSubscription: Subscription;
  private previousAuthState: boolean = false;
  darkMode: boolean;
 
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public variableManagementService: VariableManagementService,
    private menuController: MenuController,
    private modalController: ModalController,
    private authService: AuthService,
    private router: Router,
    private mqttService: MqttInterfaceService,
    private alertController: AlertController
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.authSubscription = this.authService.userIsAuthenticated.subscribe(isAuth => {
      if(!isAuth && this.previousAuthState !== isAuth) {
        this.menuController.close();
        this.router.navigateByUrl('/auth');
      }
      this.previousAuthState = isAuth;
    });
    window.onbeforeunload = () => this.ngOnDestroy();
    this.darkMode = JSON.parse(localStorage.getItem('darkMode'));
  }

  ngOnDestroy() {

    //when app is closed, update read notificiations and deleted notifications
    for(let x = 0; x < this.variableManagementService.notificationsUpdate.length; x++){
      if(this.variableManagementService.notificationsUpdate[x].isDeleted == true){
      this.variableManagementService.updateNotificationDeleted(this.variableManagementService.notificationsUpdate[x]).subscribe(() => {
      }, (error) => {
        console.log(error);
      });
    }

    if(this.variableManagementService.notificationsUpdate[x].isRead == true){
      this.variableManagementService.updateNotificationRead(this.variableManagementService.notificationsUpdate[x]).subscribe(() => {
      }, (error) => {
        console.log(error);
      });
    }
    

    }



    if(this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }


  errorPopUp(){


    this.alertController.create({
      header: "Error",
      subHeader: 'Your password must have at least 6 characters, a special character and an uppercase and lowercase character',

      
       buttons: [
        {
          text: 'Continue',
          handler: (alertData) => {},
        }
      ]
    }).then(res => {

      res.present();

    });

  }
  
  passwordSuccess(){


    this.alertController.create({
      header: "Success!",
      subHeader: 'Your password has succesfuly been changed',

      
       buttons: [
        {
          text: 'Continue',
          handler: (alertData) => {},
        }
      ]
    }).then(res => {

      res.present();

    });

  }






  deleteAccountPopUp(){

    this.alertController.create({
      subHeader: 'Please enter your username, current password and new password',
      inputs: [
        {
          name: 'email',
          placeholder: 'email'
        },
        {
          name: 'currentPassword',
          placeholder: 'current password',
          type: 'password'
        },
        {
          name: 'newPassword',
          placeholder: 'new password',
          type: 'password'
        }

      ],
      
       buttons: [
        {
          text: 'Continue',
          handler: (alertData) => {
            //Subscribe
            let num = /[0-9]/;
            let alpha = /[a-z]/;
            let cap = /[A-Z]/;
            let sym = /[@#$%^&*]/;
        if(alertData.newPassword.length >= 6){
        if(num.test(alertData.newPassword)){
          if (alpha.test(alertData.newPassword)){
            if (cap.test(alertData.newPassword)){
              if(sym.test(alertData.newPassword)){
            
            console.log(alertData.currentPassword);
            console.log(alertData.newPassword);
            console.log(alertData.email);
            this.authService.resetPassword(alertData.newPassword, alertData.currentPassword, alertData.email).subscribe(
              resData => {
                console.log(resData);
              }
            )
            this.passwordSuccess();
            }
            else{this.errorPopUp();}
          }
          else{this.errorPopUp();}
        }
        else{this.errorPopUp();}
      }
        else{this.errorPopUp();}
        }
        else{this.errorPopUp();}
        },
        },
        {
          text: 'Cancel',
          handler: () => {
          
          },
        },
      ]
    }).then(res => {

      res.present();

    });
  }




  newDevice() {
    this.menuController.close();
    this.presentIdentifyDeviceModal();
  }

  logout() {
    this.mqttService.resetMqttService();
    this.authService.logout();
  }

  async presentIdentifyDeviceModal() {
    const modal = await this.modalController.create({
      component: IdentifyDevicePage
    });

    modal.onWillDismiss().then((resData) => {
      if (resData.data) {
        switch(resData.data.type) {
          case "fertigation-system":
            console.log("Fertigation System add");
            this.presentAddFertigationSystemModal(resData.data.topicId);
            break;
          case "climate-controller":
            console.log("climatte Controller add");
            this.presentAddClimateControllerModal(resData.data.topicId);
            break;
        }
        
      }
    });
    return await modal.present();
  }

  async presentAddFertigationSystemModal(topicId: string) {
    const modal = await this.modalController.create({
      component: AddFertigationSystemPage,
      componentProps: {
        'topicId': topicId
      }
    });

    modal.onWillDismiss().then((resData) => {
      if (resData.data) {
        this.router.navigate(['/dashboard', 'monitoring'], { queryParams: { deviceType: "fertigation-system", deviceIndex: resData.data } })
      }
    });
  
    return await modal.present();
  }

  async presentAddClimateControllerModal(topicId: string) {
    const modal = await this.modalController.create({
      component: AddClimateControllerPage,
      componentProps: {
        'topicId': topicId
      }
    });

    modal.onWillDismiss().then((resData) => {
      if (resData.data) {
        this.router.navigate(['/dashboard', 'monitoring'], { queryParams: { deviceType: "climate-controller", deviceIndex: resData.data } })
      }
    });
    return await modal.present();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  
    
}
