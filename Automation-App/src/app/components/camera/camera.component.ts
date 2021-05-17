import { AddCameraPage } from './../../add-camera/add-camera.page';
import { ModalController } from '@ionic/angular';
import { Camera } from './../../models/camera.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent implements OnInit {
  @Input() cameraData: Camera;
   
  constructor(private modalCtrl : ModalController) { }

  ngOnInit() {}

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
    //onwilldismiss?
    return await modal.present();
  }
  

  onDeleteCamera(){
    console.log("Delete camera with name ", this.cameraData.name);
  }
}
