import { AddCameraPage } from './../../add-camera/add-camera.page';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Camera } from './../../models/camera.model';
import { Devices, VariableManagementService } from './../../Services/variable-management.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'cameras',
  templateUrl: './cameras.page.html',
  styleUrls: ['./cameras.page.scss'],
})
export class CamerasPage implements OnInit {
  cameras: Camera[] = [];
  noCameras: boolean;
  currentDeviceType: string;
  currentDeviceIndex: number;
  currentDevice: Devices;

  constructor(private varman: VariableManagementService,
     private route: ActivatedRoute,
     private modalCtrl : ModalController,
     private chgDetect : ChangeDetectorRef) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentDeviceType = params['deviceType'];
      this.currentDeviceIndex = params['deviceIndex'];
      if((this.currentDeviceType && this.currentDeviceIndex) != null) {
        this.currentDevice = this.varman.getCurrentDeviceSettings(this.currentDeviceType, this.currentDeviceIndex);
        this.cameras = this.currentDevice.cameras;
      }else{
        console.log(this.currentDeviceType, this.currentDeviceIndex, "cameras page ts null params");
      }
      //console.log(this.currentDevice);
    });
  }

  onCreateCamera(){
    this.presentNewCameraModal();
  }

  async presentNewCameraModal() {
    const modal = await this.modalCtrl.create({
      component: AddCameraPage,
      componentProps: {
        'name': "",
        'url': ""
      }
    });
    modal.onDidDismiss().then(() => {
      console.log("Change detect");
      this.chgDetect.detectChanges();
    })
    return await modal.present();
  }
}
