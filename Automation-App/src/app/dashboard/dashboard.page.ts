import { Component, OnInit } from '@angular/core';
import { MqttInterfaceService } from '../Services/mqtt-interface.service';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  // constructor(){}

  ngOnInit() {};
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

  TOPIC: string[] = ['esp32(system1)/distance'];

  constructor(private mqttService: MqttInterfaceService) {
    this.mqttService.mqttStatus.pipe(skip(1)).subscribe(status => {
      console.log(status);
    })
    this.mqttService.createClient(this.onConnectionLost, this.onMessageArrived, this.TOPIC, this.MQTT_CONFIG);
    
  }

  onConnectionLost(ResponseObject){
    console.log(ResponseObject);
  }

  onMessageArrived(ResponseObject){
    console.log(ResponseObject.payloadString);
  }

  onPublishMessage(){
    console.log("hello");
    this.mqttService.publishMessage(this.TOPIC[0], 'Hello');
  }
}

   

  

