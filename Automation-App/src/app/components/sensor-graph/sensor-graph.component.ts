import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sensor-graph',
  templateUrl: './sensor-graph.component.html',
  styleUrls: ['./sensor-graph.component.scss'],
})
export class SensorGraphComponent implements OnInit {
// Each instance of this uses D3JS to create a graph (inside an ionic card component).
// When we are ready for actual data, have an @Input() to bind to a specific sensor
// For now, just have fake data.

  constructor() { }

  ngOnInit() {}

}
