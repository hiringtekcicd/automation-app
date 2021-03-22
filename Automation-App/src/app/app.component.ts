import { Component } from '@angular/core';

import { MenuController, ModalController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { VariableManagementService } from './Services/variable-management.service';
import { IdentifyDevicePage } from './add-device/identify-device/identify-device.page';
import { MqttInterfaceService } from './Services/mqtt-interface.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public variableManagementService: VariableManagementService,
    private menuController: MenuController,
    private modalController: ModalController,
    private router: Router,
    private menu: MenuController,
    private mqttService: MqttInterfaceService,
    private afs: AngularFirestore
  ) {
    this.variableManagementService.fetchDevices().subscribe(
      () => {
        let mqttHost = "broker.hivemq.com";
        let topics: string[] = [];
        this.mqttService.createClient(topics, {
          host: mqttHost,
          port: 8000,
        });
        // this.menu.enable(true);
      },
      (error: any) => {
        console.log(error);
      }
    );
    console.log(
      "variableManagementService....",
      this.variableManagementService
    );
    this.initializeApp();
  }

  newDevice() {
    this.menuController.close();
    this.presentIdentifyDeviceModal();
  }

  async presentIdentifyDeviceModal() {
    const modal = await this.modalController.create({
      component: IdentifyDevicePage
    });
    return await modal.present();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout() {
    localStorage.setItem("isLogin", null);
    this.menu.enable(false);
    this.router.navigate([""]);
  }
}
