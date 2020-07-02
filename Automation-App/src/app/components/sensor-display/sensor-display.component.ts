import { Component, OnInit, Input } from '@angular/core';
import { Display } from 'src/app/dashboard/display';

@Component({
  selector: 'sensor-display',
  templateUrl: './sensor-display.component.html',
  styleUrls: ['./sensor-display.component.scss'],
})
export class SensorDisplayComponent implements OnInit {

  @Input() sensor: Display;

  constructor() {
    this.sensor = new Display("Untitled", "0", "0");
   }

  ngOnInit() {}

}
