import { Component, OnInit } from "@angular/core";
import { filter, map, skip } from "rxjs/operators";
import { MqttInterfaceService } from "src/app/Services/mqtt-interface.service";
import { ClimateControllerString, FertigationSystemString, VariableManagementService } from 'src/app/Services/variable-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Devices } from 'src/app/Services/variable-management.service';
import { SensorMonitoringWidget } from 'src/app/components/sensor-display/sensor-display.component';
import { EquipmentStatus } from "src/app/models/equipment-status";

@Component({
  selector: "app-monitoring",
  templateUrl: "./monitoring.page.html",
  styleUrls: ["./monitoring.page.scss"],
})
export class MonitoringPage implements OnInit {

  currentDevice: Devices;
  currentDeviceSettings: SensorMonitoringWidget[];
  liveData: string[];

  deviceName: string;
  timestamp: string;
  noDevices: boolean;
  noMqttConnection: boolean;

  equipmentStatus: EquipmentStatus;

  constructor(private mqttService: MqttInterfaceService, public variableManagementService: VariableManagementService, public route: ActivatedRoute, private actionSheetController: ActionSheetController, private modalController: ModalController, private router: Router) { }
 
  ngOnInit() {
    this.variableManagementService.fertigationSystemSettings.subscribe(resData =>{
      console.log(resData);
    });

    this.route.queryParams.subscribe(params => {
      let currentDeviceType = params['deviceType'];
      let currentDeviceIndex = params['deviceIndex'];

      if((currentDeviceType && currentDeviceIndex) != null) {
        this.currentDevice = this.variableManagementService.getCurrentDeviceSettings(currentDeviceType, currentDeviceIndex);
        this.currentDeviceSettings = [];
        for(let sensor in this.currentDevice.settings) {
          console.log(sensor);
          if(this.currentDevice.settings[sensor]['monit_only'] !== undefined) {
            console.log(this.currentDevice.settings[sensor]);
            this.currentDeviceSettings.push({ 
              name: sensor,
              display_name: this.currentDevice.settings[sensor].getDisplayName(),
              sensorUnit: this.getSensorUnit(sensor),
              monit_only: this.currentDevice.settings[sensor].monit_only,
              tgt: this.currentDevice.settings[sensor].control.tgt,
              alarm_min: this.currentDevice.settings[sensor].alarm_min,
              alarm_max: this.currentDevice.settings[sensor].alarm_max });
          }
        }

        this.mqttService.equipmentStatus.pipe(filter(equipmentStatus => equipmentStatus != null)).subscribe(equipmentStatus => {
          let rfArray = Object.keys(equipmentStatus.rf);
          this.currentDevice.power_outlets.forEach(powerOutlet => {
            for(let i = 0; i < rfArray.length; i++){
              if(powerOutlet.id == rfArray[i]) {
                powerOutlet.currentValue = equipmentStatus.rf[rfArray[i]];
                break;
              }
            }
          })
        });

        console.log(this.currentDeviceSettings[0].display_name);
        this.startMqttProcessing();
      } else {
        console.log(this.variableManagementService.fertigationSystemSettings.value);
        if(this.variableManagementService.fertigationSystemSettings.value.length != 0) {
          this.router.navigate(['/dashboard/monitoring'], {queryParams: {deviceType: FertigationSystemString, deviceIndex: 0}});
        } else if(this.variableManagementService.climateControllerSettings.value.length != 0) {
          this.router.navigate(['/dashboard/monitoring'], {queryParams: {deviceType: ClimateControllerString, deviceIndex: 0}});
        } else {
          this.noDevices = true;
        }
      }
    });

    this.mqttService.deviceLiveData.subscribe(resData => {
      // Try parsing system MQTT string as JSON Data
      try {
        var jsonSensorData = JSON.parse(resData);
        // Store Time Stamp of Message
        let lastUpdatedTimeStamp = new Date(jsonSensorData["time"]);
        let lastUpdatedTime = lastUpdatedTimeStamp.toTimeString().slice(0, 9);
        
        let lastUpdatedDate;
        let currentDate = new Date();
        if(lastUpdatedTimeStamp.toDateString() == currentDate.toDateString()) {
          lastUpdatedDate = "Today";
        } else {
          lastUpdatedDate = lastUpdatedTimeStamp.toDateString();
        }
        console.log(lastUpdatedTimeStamp);
        console.log(lastUpdatedDate);
        this.timestamp = lastUpdatedDate + " " + lastUpdatedTime;
        
        // Store sensor values into Display Objects to update UI
        this.liveData = jsonSensorData["sensors"];
      }
      catch(error){
        console.log(error);
      }
    });
  }

  getSensorUnit(sensorType: string){
    let sensorUnit = "";
    switch(sensorType){
      case "ec":
        sensorUnit = "μs/cm";
        break;
      case "water_temp":
      case "air_temp":
        sensorUnit = "°C";
        break;
      case "humidity":
        sensorUnit = "%";
        break;
      case "ph":
        sensorUnit = "";
        break;
      default:
        console.warn("No matching sensor unit for sensor type of ", sensorType);
        break;
    }
    return sensorUnit;
  }

  startMqttProcessing() {
    this.mqttService.mqttStatus.pipe(skip(1)).subscribe(status => {
      console.log(status);
      switch(status) {
        case "connected": {
          this.mqttService.unsubscribeToTopic('live_data/#');
          this.mqttService.unsubscribeToTopic('equipment_status/#');
          this.mqttService.subscribeToTopic('live_data/' + this.currentDevice.topicID + '/#');
          this.mqttService.subscribeToTopic('equipment_status/' + this.currentDevice.topicID);
          break;
        }
        case "disconnected": {
          this.noMqttConnection = true;
          break;
        }
      }
    });
  }
}


