import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Devices, FertigationSystemString, ClimateControllerString, VariableManagementService } from 'src/app/Services/variable-management.service';
import { FormGroup } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { ModalController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import * as _ from "lodash";
import { MqttInterfaceService } from 'src/app/Services/mqtt-interface.service';
import { ActivatedRoute } from '@angular/router';
import { FertigationSystem } from 'src/app/models/fertigation-system.model';
import { ClimateController } from 'src/app/models/climate-controller.model';
import { PowerOutlet } from 'src/app/models/power-outlet.model';
import { deviceSettingsTopic, deviceStatusTopic } from 'src/app/Services/topicKeys';

@Component({
  selector: 'app-control',
  templateUrl: './control.page.html',
  styleUrls: ['./control.page.scss'],
})

export class ControlPage implements OnInit {

  FertigationSystemString = FertigationSystemString;
  ClimateControllerString = ClimateControllerString;

  startDeviceString = "Start Device";
  stopDeviceString = "Stop Device";

  currentDevice: Devices;
  noDevices: boolean;
  currentDeviceType: string;
  currentDeviceIndex: number;

  settingsForm: FormGroup = new FormGroup({});
  growLightArray = [];

  ph: boolean = true;
  ec: boolean = true;
  waterTemperature: boolean = true;
  reservoir: boolean = true;
  growLights: boolean = true;
  irrigation: boolean = true;

  humidity: boolean = true;
  airTemperature: boolean = true;
  co2: boolean = true;

  formValue$: Observable<any>;
  isDirty: boolean = false;

  constructor(public variableManagementService: VariableManagementService, 
    public mqttService: MqttInterfaceService, 
    private changeDetector: ChangeDetectorRef, 
    private route: ActivatedRoute,
    private alertController: AlertController) { 
    this.mqttService.mqttStatus.subscribe((status) => {
      console.log(status);
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentDeviceType = params['deviceType'];
      this.currentDeviceIndex = params['deviceIndex'];

      if((this.currentDeviceType && this.currentDeviceIndex) != null) {
        this.currentDevice = this.variableManagementService.getCurrentDeviceSettings(this.currentDeviceType, this.currentDeviceIndex);
        this.changeDetector.detectChanges();
        this.settingsForm.patchValue(this.currentDevice.settings);
        if(this.currentDeviceType == FertigationSystemString) {
          if(this.currentDevice.settings['grow_lights']['power_outlets']) {
            this.growLightArray = this.currentDevice.settings['grow_lights']['power_outlets'];
          }
        }
      } else {
        let fertigationSystemCount = this.variableManagementService.fertigationSystemSettings.value.length;
        let climateControllerCount = this.variableManagementService.climateControllerSettings.value.length;
        if((fertigationSystemCount && climateControllerCount) == 0) {
          this.noDevices = true;
        } 
      }
    });
    this.formValue$ = this.settingsForm.valueChanges.pipe(debounceTime(300), filter(() => this.noDevices != true));
    this.formValue$.subscribe((formValue) => {   
      let a = JSON.parse(JSON.stringify(formValue));
      let b = JSON.parse(JSON.stringify(this.currentDevice.settings));
      this.isDirty = (_.isEqual(a, b) == false);
    });
  }

  onAddPowerOutlet(newPowerOutlet: PowerOutlet) {
    this.currentDevice.power_outlets.push(newPowerOutlet);
    this.onSettingsFormSubmit();
    this.changeDetector.detectChanges();
  }

  onBootButtonClick() {
    this.currentDevice.device_started = !this.currentDevice.device_started;
    this.mqttService.publishMessage(deviceStatusTopic + "/" + this.currentDevice.topicID, this.currentDevice.device_started? "1" : "0");
    this.onSettingsFormSubmit();    
  }
   
  // update data in backend
  onSettingsFormSubmit() {
    console.log(this.settingsForm);
    if(!this.settingsForm.valid){
      console.warn("onSubmit with errors");
      this.presentInvalidSubmitDialog();
      return;
    }
    console.log("onSubmit valid");
    
    var changedData = [];
    for(var key in this.settingsForm.value) {
      console.log(key);
      console.log(this.settingsForm.value[key]);
      let a = JSON.parse(JSON.stringify(this.settingsForm.value[key]));
      let b = JSON.parse(JSON.stringify(this.currentDevice.settings[key]));
      let isDirty = (_.isEqual(a, b) == false);
      if(isDirty) {
        console.log(key);
        changedData.push({
          topic: deviceSettingsTopic + "/" + this.currentDevice.topicID,
          payload: JSON.stringify({ [key]: this.settingsForm.value[key] }),
          qos: 1,
          retained: false
        });
      }
    }

    if(changedData.length <= 0) {
      console.warn("Attempted to save with even though no data changed");
      return;
    }
    
    console.log(changedData);
    this.mqttService.publishMultipleMessages(changedData).then(() => {
      let tempDevice;
      let device: Devices;
      tempDevice = { ...this.currentDevice };
      tempDevice.settings = this.settingsForm.value;
      if(this.currentDeviceType == FertigationSystemString) {
        device = new FertigationSystem().deserialize(tempDevice);
        console.log(device);
      } 
      else if(this.currentDeviceType == ClimateControllerString) {
        console.log(tempDevice);
        device = new ClimateController().deserialize(tempDevice);
        console.log(device);
      } else {
        console.warn("Unable to Save to Cloud: Unkown Device Type");
        return;
      }
      this.variableManagementService
        .updateDeviceSettings(device, this.currentDeviceType, this.currentDevice._id, this.currentDeviceIndex)
          .subscribe(() => {
            this.currentDevice = device;
            this.isDirty = false;
            this.presentValidSubmitDialog();
          }, (error) => {console.warn(error)});
    },
    (error) => {
      console.warn(error);
    });
  }

  async presentInvalidSubmitDialog(){
    const alert = await this.alertController.create({
      header: "Error",
      message: "There are mistakes in the information entered. Please correct the fields marked in red.",
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentValidSubmitDialog(){
    const alert = await this.alertController.create({
      header: "Successfully Saved",
      message: "The information has been successfully saved.",
      buttons: ['OK']
    });
    await alert.present();
  }
}

