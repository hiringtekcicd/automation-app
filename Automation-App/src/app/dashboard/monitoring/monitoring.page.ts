import { Component, OnInit } from "@angular/core";
import { Display } from "../display";
import { skip } from "rxjs/operators";
import { MqttInterfaceService } from "src/app/Services/mqtt-interface.service";
import { VariableManagementService } from 'src/app/variable-management.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: "app-monitoring",
  templateUrl: "./monitoring.page.html",
  styleUrls: ["./monitoring.page.scss"],
})
export class MonitoringPage implements OnInit {

  systemID: string;
  growRoomID: string;

  public specifications = [
    "Humidifier",
    "Fan 2",
    "pH Probe",
    "Grow Lights",
    "EC Probe",
    "Water Temp Probe",
  ];

  MQTT_CONFIG: {
    host: string;
    port: number;
    clientId: string;
    path?: string;
  } = {
    host: "192.168.1.16",
    port: 9001,
    clientId: "Test",
  };

  TOPIC: string[] = ["system1/sensors/ph"];

  constructor(private mqttService: MqttInterfaceService, public variableManagentService: VariableManagementService, public route: ActivatedRoute, private router: Router) {
    this.mqttService.mqttStatus.pipe(skip(1)).subscribe((status) => {
      console.log(status);
    });
    this.mqttService.createClient(
      this.onConnectionLost,
      this.TOPIC,
      this.MQTT_CONFIG
    );

    // Fetch Display Data from Database
    this.variableManagentService.fetchBotData();
  }
 
  ngOnInit() {
    // Set Default Grow Room and System
    this.variableManagentService.updateVariables(null, null);
    this.mqttService.sensorLiveData.subscribe(resData => {
      // TODO: Identify if data is grow room or nft system variable.
      for(var i = 0; i < this.variableManagentService.systemVariableDisplays.length; i++){
        if(this.variableManagentService.systemVariableDisplays[i].title == resData.topic){
          this.variableManagentService.systemVariableDisplays[i].current_val = resData.data;
          break;
        }
      }
      for(var i = 0; i < this.variableManagentService.growRoomVariableDisplays.length; i++){
        if(this.variableManagentService.growRoomVariableDisplays[i].title == resData.topic){
          this.variableManagentService.growRoomVariableDisplays[i].current_val = resData.data;
          break;
        }
      }
    });

    // Subscribe to changes in System ID
    this.variableManagentService.selectedSystem.subscribe(resData => {
      this.systemID = resData.toString();
    })
    
    // Update GrowRoom ID selection
    this.growRoomID = this.variableManagentService.selectedGrowRoom;
  }

  // Change System 
  changeSystem(systemName : string){
    this.variableManagentService.updateVariables(this.growRoomID, systemName);
  }

  // Change Grow Room
  changeGrowRoom(growRoomName: string){
    this.variableManagentService.updateVariables(growRoomName, null);
  }

  onConnectionLost(ResponseObject) {
    console.log(ResponseObject);
  }
  
  onPublishMessage() {
    // var name : number;
    // console.log('hello');
    // this.name = ['7']
    this.mqttService.publishMessage(this.TOPIC[0], "hello");
  }
}
