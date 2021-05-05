import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PowerOutlet } from '../models/power-outlet.model';
import { MqttInterfaceService } from '../Services/mqtt-interface.service';

@Component({
  selector: 'app-add-power-outlet',
  templateUrl: './add-power-outlet.page.html',
  styleUrls: ['./add-power-outlet.page.scss'],
})
export class AddPowerOutletPage implements OnInit {

  @Input() powerOutletName: string;

  powerOutletIndex = -1;
  outletToggleVal = false;

  readonly powerOutletStructure: PowerOutlet[] = 
  [
      new PowerOutlet("0", "Water Cooler", "snow-outline"),
      new PowerOutlet("1", "Water Heater", "flame-outline"),
      new PowerOutlet("2", "Irrigation", "water-outline"),
      new PowerOutlet("3", "Reservoir Water In", "return-down-back-outline"),
      new PowerOutlet("4", "Reservoir Water Out", "return-down-forward-outline"),
      new PowerOutlet("5", "Growlight", "sunny-outline")
  ]

  constructor(public modalController: ModalController, private mqttService: MqttInterfaceService) { }

  ngOnInit() {
    for (let i = 0; i < this.powerOutletStructure.length; i++) {
      if(this.powerOutletStructure[i].name == this.powerOutletName) {
        this.powerOutletIndex = i;
        break;
      } 
    }
  }

  toggleOutlet() {
    let outletObj = {
      [this.powerOutletStructure[this.powerOutletIndex].id]: this.outletToggleVal
    }
    let outletJsonString = JSON.stringify(outletObj);
    this.mqttService.publishMessage("manual_rf_control/a23b5", outletJsonString, 1, false);
  }

  addPowerOutlet() {
    this.modalController.dismiss(this.powerOutletStructure[this.powerOutletIndex]);
  }

}
