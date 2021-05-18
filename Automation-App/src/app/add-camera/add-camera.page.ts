import { Devices } from './../Services/variable-management.service';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { VariableManagementService } from 'src/app/Services/variable-management.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { Camera } from '../models/camera.model';


@Component({
  selector: 'add-camera',
  templateUrl: './add-camera.page.html',
  styleUrls: ['./add-camera.page.scss'],
})
export class AddCameraPage implements OnInit {
  cameraForm: FormGroup = new FormGroup({});
  @Input() name: string;
  @Input() url: string;
  currentDeviceType: string;
  currentDeviceIndex: number;
  currentDevice: Devices;

  constructor(private fb : FormBuilder, 
    private varman : VariableManagementService, 
    public modalCtrl : ModalController,
    private route: ActivatedRoute) {}

  ngOnInit() {
    console.log(this.url);
    this.cameraForm = this.fb.group({
      'cam_name': this.fb.control(this.name),
      'cam_url': this.fb.control(this.url)
    });
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

  onFormSubmit(){
    //validate and submit changes
    if(!this.cameraForm.valid){
      return;
    }
    //save to server
    let deviceCopy;
    deviceCopy = {...this.currentDevice};
    const cameraIdx = deviceCopy.cameras.findIndex(element => {
      return element.name === this.name; //the *original* name of camera
    });
    if(cameraIdx === -1){//does not exist, create it
      deviceCopy.cameras.push({
        'name': this.cameraForm.value['cam_name'],
        'url': this.cameraForm.value['cam_url']
    });
    }else{//replace current camera
      deviceCopy.cameras[cameraIdx]['name'] = this.cameraForm.value['cam_name'];
      deviceCopy.cameras[cameraIdx]['url'] = this.cameraForm.value['cam_url'];
    }

    this.varman.updateDeviceSettings(deviceCopy, this.currentDeviceType, deviceCopy._id, this.currentDeviceIndex)
      .subscribe(()=>{
        this.currentDevice = deviceCopy;
      }, (error) => {
        console.log(error)
      }
    );
    this.modalCtrl.dismiss();
  }

}
