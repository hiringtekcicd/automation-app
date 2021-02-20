import { Component, OnInit, Input } from '@angular/core';
import { MqttInterfaceService } from 'src/app/Services/mqtt-interface.service';

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

interface SensorMonitoringWidget {
  current_val: number;
  title: string;
  monit_only: boolean;
  tgt: number;
  alarm_min: number;
  alarm_max: number;
}
