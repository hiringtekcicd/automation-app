import { Component, Input, OnInit } from '@angular/core';
import { PowerOutlet } from 'src/app/models/power-outlet.model';
import { MqttInterfaceService } from 'src/app/Services/mqtt-interface.service';
import { manualRfControlTopic } from 'src/app/Services/topicKeys';

@Component({
  selector: 'power-outlet',
  templateUrl: './power-outlet.component.html',
  styleUrls: ['./power-outlet.component.scss'],
})
export class PowerOutletComponent implements OnInit {

  @Input() data: PowerOutlet;
  @Input() topicID: string;

  constructor(private mqttService: MqttInterfaceService) { }

  ngOnInit() {}

  onToggleClick() {
    let outletObj = {
      [this.data.id]: !this.data.currentValue 
    }

    let outletJsonString = JSON.stringify(outletObj);
    // TODO change to variable Topic ID
    this.mqttService.publishMessage(manualRfControlTopic + "/" + this.topicID, outletJsonString, 1, false);
  }
}
