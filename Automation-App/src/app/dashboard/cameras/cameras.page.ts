import { ActivatedRoute } from '@angular/router';
import { Camera } from './../../models/camera.model';
import { Devices, VariableManagementService } from './../../Services/variable-management.service';
import { Component, OnInit } from '@angular/core';

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

  constructor(private varman: VariableManagementService, private route: ActivatedRoute) {}

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
      console.log(this.currentDevice);
    });
  }
}
