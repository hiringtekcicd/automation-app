import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Devices, FertigationSystemString, ClimateControllerString, VariableManagementService } from 'src/app/variable-management.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { AddGrowroomPage } from 'src/app/add-growroom/add-growroom.page';
import { AddSystemPage } from 'src/app/add-system/add-system.page';
import { CreateClusterPage } from 'src/app/create-cluster/create-cluster.page';
import { ModalController } from '@ionic/angular';
import { Observable, combineLatest } from 'rxjs';
import * as _ from "lodash";
import { MqttInterfaceService } from 'src/app/Services/mqtt-interface.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-control',
  templateUrl: './control.page.html',
  styleUrls: ['./control.page.scss'],
})

export class ControlPage implements OnInit {

  FertigationSystemString = FertigationSystemString;
  ClimateControllerString = ClimateControllerString;

  currentDeviceSettings: Devices;
  noDevices: boolean;
  currentDeviceType: string;

  settingsForm: FormGroup = new FormGroup({});

  deviceName: string;
  clusterName: string;
  isGrowRoom: boolean;
  isSystem: boolean;

  ph: boolean = true;
  ec: boolean = true;
  water_temperature: boolean = true;

  humidity: boolean = true;
  air_temperature: boolean = true;

  formValue$: Observable<any>;
  isDirty: boolean = false;

  constructor(public variableManagementService: VariableManagementService, private fb: FormBuilder, private changeDetector: ChangeDetectorRef, private modalController: ModalController, private mqttService: MqttInterfaceService, private route: ActivatedRoute) { 
  //  this.variableManagementService.fetchClusters(false);
    this.mqttService.mqttStatus.subscribe((status) => {
      console.log(status);
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentDeviceType = params['deviceType'];
      let currentDeviceIndex = params['deviceIndex'];

      if((this.currentDeviceType && currentDeviceIndex) != null) {
        this.currentDeviceSettings = this.variableManagementService.getCurrentDeviceSettings(this.currentDeviceType, currentDeviceIndex);
        this.settingsForm.patchValue(this.currentDeviceSettings);
      } else {
        let fertigationSystemCount = this.variableManagementService.fertigationSystemSettings.value.length;
        let climateControllerCount = this.variableManagementService.climateControllerSettings.value.length
        if((fertigationSystemCount && climateControllerCount) == 0) {
          this.noDevices = true;
        } 
      }
    });

    // this.formValue$ = this.settingsForm.valueChanges.pipe(debounceTime(300), filter(() => this.variableManagementService.deviceSettings.length != 0));
    // combineLatest(this.formValue$, this.variableManagementService.deviceSettingsSubject).subscribe(([a, b]) => {
    //   console.log(a);
    //   this.isDirty = (_.isEqual(a, this.variableManagementService.deviceSettings[this.variableManagementService.deviceSettingsIndex].settings) === false);
    // });
    // // Respond to grow room settings data fetched from backend
    // this.variableManagementService.deviceSettingsSubject.pipe(filter((sameData) => sameData === false)).subscribe(() => {
    //   //Reset systems Form and populate control fields with settings data
    //   this.settingsForm.reset();
    //   if(this.variableManagementService.deviceSettings[this.variableManagementService.deviceSettingsIndex].type == 'system'){
    //     this.isSystem = true;
    //     this.isGrowRoom = false;
    //   } else if (this.variableManagementService.deviceSettings[this.variableManagementService.deviceSettingsIndex].type == 'growroom'){
    //     this.isSystem = false;
    //     this.isGrowRoom = true;
    //   }
    //   this.changeDetector.detectChanges();
    //   this.settingsForm.patchValue(this.variableManagementService.deviceSettings[this.variableManagementService.deviceSettingsIndex].settings);
    // }); 

    // // Subscribe to changes in System ID
    // this.variableManagementService.selectedDevice.pipe(filter((str) => str != null)).subscribe(resData => {
    //   // Delete exisiting sensor cards
    //   this.resetDevice();
    //   this.deviceName = resData;
    //   // add sensor cards based on sensors for system
    //   this.variableManagementService.sensorDisplays.forEach((element) => {
    //     switch(element.title) {
    //       case "ph":
    //         this.ph = true;
    //         break;
    //       case "ec":
    //         this.ec = true;
    //         break;
    //       case "water temp":
    //         this.water_temperature = true;
    //         break;
    //       case "humidity":
    //         this.humidity = true;
    //         break;
    //       case "air_temperature":
    //         this.air_temperature = true;
    //         break;
    //     }
    //   });
    //   // Detect and update UI
    //   this.changeDetector.detectChanges();
    //   // Check if settings data is already stored locally
    //   var dataIndex = this.variableManagementService.deviceSettings.findIndex(({clusterName, name}) => clusterName === this.clusterName && name === this.deviceName);
    //   // If data is stored locally populate systems form with settings data
    //   // If data isn't found locally fetch it from backend
    //   if(dataIndex != -1){
    //     this.variableManagementService.deviceSettingsIndex = dataIndex;
    //     this.variableManagementService.deviceSettingsSubject.next(false);
    //   } else {
    //     this.variableManagementService.getDeviceSettings();
    //   }
    // });
  }
  
  // update data in backend
  pushData(deviceForm: any){
    var changedData = [];
    for(var key in deviceForm){
      if(!_.isEqual(deviceForm[key], this.variableManagementService.deviceSettings[this.variableManagementService.deviceSettingsIndex].settings[key])) {
        changedData.push({ [key]: deviceForm[key] });
      }
    }
    console.log(changedData);
    this.mqttService.publishMessage("D1000/device_settings", JSON.stringify({ data: changedData}), 1, false).then(() => {
      console.log("mqttservice published");
      this.variableManagementService.updateDeviceSettings(this.settingsForm.value).subscribe(() => {}, (error) => {console.log(error)});
    },
    (error) => {
      console.log(error);
    });
  }

  // delete system sensor cards 
  resetDevice(){
    this.ph = false;
    this.ec = false;
    this.water_temperature = false;
    this.settingsForm.reset();
    this.changeDetector.detectChanges();
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

  async presentClusterModal() {
    const modal = await this.modalController.create({
      component: CreateClusterPage,
    });
    return await modal.present();
  }
}
