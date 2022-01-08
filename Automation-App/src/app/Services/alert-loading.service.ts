import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { MqttInterfaceService } from './mqtt-interface.service';

@Injectable({
  providedIn: 'root'
})
export class AlertLoadingService {

  private isLoading = false;

  constructor(private loadingController: LoadingController, private alertController: AlertController, private mqttService: MqttInterfaceService) { }

  async presentLoadingScreen(message?: string) {
    message? message : message = 'Please Wait...';
    this.isLoading = true;

    return await this.loadingController.create({
      message: message
    }).then(controller => {
      controller.present().then(() => {
        if (!this.isLoading) {
          controller.dismiss();
          console.log(controller);
        }
      });
    });
  }

  async dismissLoadingScreen() {
    this.isLoading = false;
    while (await this.loadingController.getTop() !== undefined) {
      await this.loadingController.dismiss();
    }
  }

  async presentMongoPushError() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Unable to connect to Hydrotek Cloud',
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentPushSettingsToDeviceError() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Unable to push settings to device',
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentFertigationUpdateAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Update Fertigation Systems',
      subHeader: 'Subtitle',
      message: 'One or more of your Fertigation Systems are not up to date. Click continue to update them now.',
      buttons: ['Later', 'Continue']
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();

    if(role == 'Continue') {
      this.mqttService.publishMessage("ota-fertigation-system", message, 1);
    }
  }
}
