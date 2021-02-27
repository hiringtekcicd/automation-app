import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sensor-display',
  templateUrl: './sensor-display.component.html',
  styleUrls: ['./sensor-display.component.scss'],
})
export class SensorDisplayComponent implements OnInit {

  @Input() sensor: SensorMonitoringWidget;

  constructor() {}

  ngOnInit() { }
}

export interface SensorMonitoringWidget {
  name: string,
  current_val: number;
  display_name: string;
  monit_only: boolean;
  tgt: number;
  alarm_min: number;
  alarm_max: number;
}
