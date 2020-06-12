import { Component, OnInit } from '@angular/core';
import {Display} from '../display';
import { MqttInterfaceService } from '/automation/automation-app/Automation-App/src/app/Services/mqtt-interface.service';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.page.html',
  styleUrls: ['./monitoring.page.scss'],
})
export class MonitoringPage implements OnInit {

   livereadings :string;
  ph: Display = new Display('pH','5.1-5.9',12);
  Ec: Display = new Display('EC','1.5-2.2',1);
  Water_temp: Display =  new Display('watertemp','22-33',0.5);
  Humidity: Display = new Display('Humidity', '20-40',9.2);
  CO2: Display = new Display('CO2', '8.6-9.5',9.2);
  Air_temp: Display = new Display('Air Temp', '21-28',26);

  public systems =[ this.ph, this.Ec, this.Water_temp];
  public grows =[ this.Humidity, this.CO2, this.Air_temp];

  public specifications =[ "Humidifier" , "Fan 2" ,"pH Probe","Grow Lights","EC Probe","Water Temp Probe"] ;               

  //  constructor() { } 
   ngOnInit() {};
  MQTT_CONFIG: {
    host: string,
    port: number,
    clientId: string,
    path?: string,
  } =  {
    host: '70.94.9.135',
    port: 9001,
    clientId: 'Test',
  }

  TOPIC: string[] = ['pH'];

  constructor(private mqttService: MqttInterfaceService) {
    this.mqttService.mqttStatus.pipe(skip(1)).subscribe(status => {
      console.log(status);
    })
    this.mqttService.createClient(this.onConnectionLost, this.onMessageArrived, this.TOPIC, this.MQTT_CONFIG);
    
  }

  onConnectionLost(ResponseObject){
    console.log(ResponseObject);
  }
 
  onMessageArrived( ResponseObject){
     this.livereadings = ResponseObject.payloadString
     console.log(this.livereadings);
     document.getElementById("ResponseObject").innerHTML  += this.livereadings;
   }

  onPublishMessage(){
    // var name : number;
    // console.log('hello');
    // this.name = ['7']  
    this.mqttService.publishMessage(this.TOPIC[0], 'hello');    
  }

}
