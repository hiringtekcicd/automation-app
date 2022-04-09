import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sensor-testing',
  templateUrl: './sensor-testing.component.html',
  styleUrls: ['./sensor-testing.component.scss'],
})
export class SensorTestingComponent implements OnInit {
  @Input() sensor: SensorMonitoringWidget;

  @Input() 
  set allLiveData(allLiveData: string[]) {
    if (allLiveData) {
      for(let i = 0; i < allLiveData.length; i++) {
        if(allLiveData[i]["name"] == this.sensor.name) {
          this.currentVal = allLiveData[i]["value"];
          break;
        }
      }
    }
  }

  currentVal: number = 0;

  constructor() { }

  ngOnInit() {}

}

export interface SensorMonitoringWidget {
  name: string,
  display_name: string;
  sensorUnit: string;
  monit_only: boolean;
  tgt: number;
  alarm_min: number;
  alarm_max: number;
}
