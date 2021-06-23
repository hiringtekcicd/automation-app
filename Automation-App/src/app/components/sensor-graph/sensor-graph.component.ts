import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3-selection';

@Component({
  selector: 'sensor-graph',
  templateUrl: './sensor-graph.component.html',
  styleUrls: ['./sensor-graph.component.scss'],
})
export class SensorGraphComponent implements OnInit {
// Each instance of this uses D3JS to create a graph (inside an ionic card component).
// When we are ready for actual data, have an @Input() to bind to a specific sensor
// For now, just have fake data.
  
  constructor() {}

  ngOnInit() {
    this.buildGraph();
  }

  buildGraph(){
    const svgContainer = d3.select("svg").style('border', '1px solid black');
  }
}
