import { VariableManagementService, Devices } from 'src/app/Services/variable-management.service';
import { ActivatedRoute } from '@angular/router';
import { AddCameraPage } from './../../add-camera/add-camera.page';
import { ModalController } from '@ionic/angular';
import { Camera } from './../../models/camera.model';
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent implements OnInit {
  @Input() cameraData: Camera;
  currentDeviceType: string;
  currentDeviceIndex: number;
  currentDevice: Devices;
   
  constructor(private modalCtrl : ModalController,
    private route : ActivatedRoute,
    private varman : VariableManagementService,
    private chgDetect : ChangeDetectorRef) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentDeviceType = params['deviceType'];
      this.currentDeviceIndex = params['deviceIndex'];
      if((this.currentDeviceType && this.currentDeviceIndex) != null) {
        this.currentDevice = this.varman.getCurrentDeviceSettings(this.currentDeviceType, this.currentDeviceIndex);
      }else{
        console.log(this.currentDeviceType, this.currentDeviceIndex, "cameras page ts null params");
      }
    });
  }

  onEditCamera(){
    console.log("Edit camera with name ",this.cameraData.name);
    this.presentCameraModal();
  }

  async presentCameraModal() {
    const modal = await this.modalCtrl.create({
      component: AddCameraPage,
      componentProps: {
        'name': this.cameraData.name,
        'url': this.cameraData.url
      }
    });
    modal.onDidDismiss().then(() => {
      console.log("Change detect");
      this.chgDetect.detectChanges();
    });
    return await modal.present();
  }
}
