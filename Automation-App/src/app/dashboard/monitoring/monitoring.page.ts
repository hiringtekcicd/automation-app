import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.page.html',
  styleUrls: ['./monitoring.page.scss'],
})
export class MonitoringPage implements OnInit {
  
 public systems =[ { "live": "5.6","name" : "pH" , "value" : "5.1-5.9"},
                   { "live": "1.9","name" : "EC" , "value" : "1.5 - 2.2"},
                   { "live": "24","name" : "waterTemp" , "value" : "22 - 33"}];

public grows =[ { "live": "30","name" : "Humidity" , "value" : "20 - 40"},
                 { "live": "9.2","name" : "Co2" , "value" : "8.6 - 9.5"},
                { "live": "26","name" : "Air Temp" , "value" : "21 - 28"}];
  public specifications =[ "Humidifier" , "Fan 2" ,"pH Probe","Grow Lights","EC Probe","Water Temp Probe"] ;               

  constructor() { }
  ngOnInit() {
  }

}
