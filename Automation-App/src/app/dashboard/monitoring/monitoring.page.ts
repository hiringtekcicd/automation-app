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
  Water_temp: Display =  new Display('Water Temp','22-33', 0.5);

 public systems =[ this.ph,
                  this.Ec,
                  this.Water_temp];

public grows =[ { "live": "30","name" : "Humidity" , "value" : "20 - 40"},
                 { "live": "9.2","name" : "Co2" , "value" : "8.6 - 9.5"},
                { "live": "26","name" : "Air Temp" , "value" : "21 - 28"}];
  public specifications =[ "Humidifier" , "Fan 2" ,"pH Probe","Grow Lights","EC Probe","Water Temp Probe"] ;               

  constructor() { } 
  ngOnInit() {
  }

}
