import { Component } from '@angular/core';
import { MqttInterfaceService } from '../Services/mqtt-interface.service';

import { skip } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  MQTT_CONFIG: {
    host: string,
    port: number,
    clientId: string,
    path?: string,
  } =  {
    host: '192.168.1.16',
    port: 9001,
    clientId: 'Test',
  }

  TOPIC: string[] = ['sensor/distance'];

  constructor(private mqttService: MqttInterfaceService) {
    this.mqttService.mqttStatus.pipe(skip(1)).subscribe(status => {
      console.log(status);
    })
    this.mqttService.createClient(this.onConnectionFailure, this.onConnectionLost, this.onMessageArrived, this.TOPIC, this.MQTT_CONFIG);
    
  }

  onConnectionFailure(ResponseObject){
    console.log(ResponseObject);
  }

  onConnectionLost(ResponseObject){
    console.log(ResponseObject);
  }

  onMessageArrived(ResponseObject){
    console.log(ResponseObject.payloadString);
  }

  onPublishMessage(){
    this.mqttService.publishMessage(this.TOPIC[0], 'Hello');
  }

  

}
