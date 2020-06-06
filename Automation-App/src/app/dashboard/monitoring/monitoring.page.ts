import { Component, OnInit } from '@angular/core';
import {Display} from '../display'

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.page.html',
  styleUrls: ['./monitoring.page.scss'],
})
export class MonitoringPage implements OnInit {

  ph: Display = new Display('pH', '1-1.2', 12);
  Ec: Display = new Display('EC','1.5-2.2', 1);
  Water_temp: Display =  new Display('Water temp','22-33', 0.5);
  Humidity: Display = new Display('Humidity', '20-40', 9.2);
  CO2: Display = new Display('CO2', '8.6-9.5', 9.2);
  Air_temp: Display = new Display('Air Temp', '21-28', 26);

  public systems =[ this.ph, this.Ec, this.Water_temp];
  public grows =[ this.Humidity, this.CO2, this.Air_temp];

  public specifications =[ "Humidifier" , "Fan 2" ,"pH Probe","Grow Lights","EC Probe","Water Temp Probe"] ;               

  constructor() { } 
  ngOnInit() {
  }

}
