import { Component, OnInit } from "@angular/core";
import { skip, filter } from "rxjs/operators";
import { MqttInterfaceService } from "src/app/Services/mqtt-interface.service";
import { VariableManagementService } from 'src/app/variable-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AddGrowroomPage } from 'src/app/add-growroom/add-growroom.page';
import { AddSystemPage } from 'src/app/add-system/add-system.page';
import { AddSensorPage } from 'src/app/add-sensor/add-sensor.page';
import { CreateClusterPage } from 'src/app/create-cluster/create-cluster.page';
import { SensorDisplayComponent } from 'src/app/components/sensor-display/sensor-display.component';
import { IdentifyDevicePage } from 'src/app/add-device/identify-device/identify-device.page';
import { Devices } from 'src/app/variable-management.service';

@Component({
  selector: "app-monitoring",
  templateUrl: "./monitoring.page.html",
  styleUrls: ["./monitoring.page.scss"],
})
export class MonitoringPage implements OnInit {

  currentDeviceSettings: Devices;

  deviceName: string;
  clusterName: string;
  timeStamp: string;
  noDevices: boolean;
  
  deviceAlertOptions: any = {
    header: "Device Name"
  }

  clusterAlertOptions: any = {
    header: "Cluster Name"
  }

  constructor(private mqttService: MqttInterfaceService, public variableManagementService: VariableManagementService, public route: ActivatedRoute, private actionSheetController: ActionSheetController, private modalController: ModalController) {
    // Log MQTT Status
    this.mqttService.mqttStatus.pipe(skip(1)).subscribe((status) => {
      console.log(status);
    });

    // Fetch Display Data from Database
  //  this.variableManagentService.fetchClusters(false);
  }
 
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let currentDeviceType = params['deviceType'];
      let currentDeviceIndex = params['deviceIndex'];

      if((currentDeviceType && currentDeviceIndex) != null) {
        this.currentDeviceSettings = this.variableManagementService.getCurrentDeviceSettings(currentDeviceType, currentDeviceIndex);
      } else {
        console.log(this.variableManagementService.fertigationSystemSettings.value);
        if(this.variableManagementService.fertigationSystemSettings.value.length != 0) {
          this.currentDeviceSettings = this.variableManagementService.getCurrentDeviceSettings('fertigation-system', 0);
        } else if(this.variableManagementService.climateControllerSettings.value.length != 0) {
          this.currentDeviceSettings = this.variableManagementService.getCurrentDeviceSettings('climate-controller', 0);
        } else {
          this.noDevices = true;
        }
      }
    });

    // Set Default Grow Room and System



    this.mqttService.deviceLiveData.subscribe(resData => {
      // Try parsing system MQTT string as JSON Data
      try{
        var jsonSensorData = JSON.parse(resData);
        // Store Time Stamp of Message
        this.timeStamp = jsonSensorData["time"];
        // Store sensor values into Display Objects to update UI
        for(var i = 0; i < this.variableManagementService.sensorDisplays.length; i++){
          for(var j = 0; j < jsonSensorData["sensors"].length; j++){
            if(jsonSensorData["sensors"][j].name == this.variableManagementService.sensorDisplays[i].title){
              this.variableManagementService.sensorDisplays[i].current_val = jsonSensorData["sensors"][j].value;
            }
          }
        }
      }
      catch(error){
        console.log(error);
      }
    });

    // Subscribe to changes in System ID
    this.variableManagementService.selectedDevice.pipe(filter(str => str != null)).subscribe(resData => {
      console.log("monitoring page selected device");
      this.deviceName = resData;
    });
    
    // Update GrowRoom ID selection
    this.variableManagementService.selectedCluster.pipe(filter(str => str != null)).subscribe(resData => {
      console.log("monitoring page selected cluster");
      this.clusterName = resData;
    });
  }

  // // Change System 
  // changeDevice(deviceName : string){
  //   console.log("change device monitoring page");
  //   if(this.variableManagentService.selectedDevice.value != deviceName){
  //     this.variableManagentService.updateCurrentCluster(this.clusterName, deviceName);
  //   }
  // }

  // // Change Grow Room
  // changeCluster(clusterName: string){
  //   console.log("change cluster monitoring page");
  //   this.variableManagentService.updateCurrentCluster(clusterName, null);
  // }

  async presentModalIdentifyDevice() {
    const modal = await this.modalController.create({
      component: IdentifyDevicePage,
    });
    return await modal.present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Setup',
      buttons: [{
        text: 'Cluster',
        handler: () => {
          this.presentClusterModal();
        }
      },{
        text: 'Grow Room',
        handler: () => {
          this.presentGrowRoomModal();
        }
      }, {
        text: 'System',
        handler: () => {
          this.presentSystemModal();
        }
      }, {
        text: 'Sensor',
        handler: () => {
          this.presentSensorModal();
        }
      },{
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async presentGrowRoomModal() {
    const modal = await this.modalController.create({
      component: AddGrowroomPage,
    });
    return await modal.present();
  }

  async presentSystemModal() {
    const modal = await this.modalController.create({
      component: AddSystemPage,
    });
    return await modal.present();
  }

  async presentSensorModal() {
    const modal = await this.modalController.create({
      component: AddSensorPage,
    });
    return await modal.present();
  }

  async presentClusterModal() {
    const modal = await this.modalController.create({
      component: CreateClusterPage,
    });
    return await modal.present();
  }
}
