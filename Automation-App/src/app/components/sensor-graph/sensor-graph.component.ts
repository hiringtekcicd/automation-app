import { Component, Input, OnInit } from "@angular/core";
import * as d3 from "d3";

@Component({
  selector: "sensor-graph",
  templateUrl: "./sensor-graph.component.html",
  styleUrls: ["./sensor-graph.component.scss"],
})
export class SensorGraphComponent implements OnInit {
  // Each instance of this uses D3JS to create a graph (inside an ionic card component).
  // When we are ready for actual data, have an @Input() to bind to a specific sensor

  constructor() {}

  ngOnInit() {
    this.buildGraph();
  }

  //had https://bl.ocks.org/mbostock/3883245
  //had https://www.d3-graph-gallery.com/graph/line_basic.html
  //observable, which also doesn't work https://observablehq.com/@d3/line-chart

  //Currently following https://vizartpandey.com/creating-simple-line-charts-using-d3-js-part-01/
  async buildGraph() {
    //load data TODO use actual Input() data!
    const dataset = await d3.csv("./assets/data.csv");

    //X/Y access functions
    const yAccessor = (d) => +d.value; //This needs to be a number, not a string, otherwise scaling is weird
    const dateParser = d3.timeParse("%Y-%m-%d");
    const xAccessor = (d) => dateParser(d.date);

    //Dimensions on page for the graph
    let dimensions = {
      width: 500,
      height: 350,
      margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 30,
      },
      boundedWidth: 0,
      boundedHeight: 0,
    };
    dimensions.boundedWidth =
      dimensions.width - dimensions.margin.left - dimensions.margin.right;
    dimensions.boundedHeight =
      dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

    //Wrapper and bounds divs
    const wrapper = d3
      .select("#wrapper")
      .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

    const bounds = wrapper
      .append("g")
      .style(
        "transform",
        `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`
      );

    //Scaling functions
    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(dataset, yAccessor))
      .range([dimensions.boundedHeight, 0]);

      console.warn(d3.max(dataset, yAccessor));
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(dataset, xAccessor))
      .range([0, dimensions.boundedWidth]);

    //Line generation (data points)
    const lineGenerator = d3
      .line()
      .x((d) => xScale(xAccessor(d)))
      .y((d) => yScale(yAccessor(d)));
    const line = bounds
      .append("path")
      .attr("d", lineGenerator(dataset))
      .attr("fill", "none")
      .attr("stroke", "Blue")
      .attr("stroke-width", 2);

    //Axes
    //Customization: see https://ghenshaw-work.medium.com/customizing-axes-in-d3-js-99d58863738b

    const yAxisGenerator = d3.axisLeft().scale(yScale); //make sure there is enough margin so it doesn't cut off digits (margin left)
    const yAxis = bounds.append("g").call(yAxisGenerator);
    const xAxisGenerator = d3.axisBottom().scale(xScale);
    //xAxisGenerator.ticks(5); //Sets number of auto-gen'd ticks
    //xAxisGenerator.tickSize(-100); //negative tick size = grid-like, goes into the graph
    const xAxis = bounds
      .append("g")
      .style("transform", `translate(0px,${dimensions.boundedHeight}px)`) //make it an actual bottom x-axis
      .call(xAxisGenerator);
    xAxis.select(".domain").remove(); // Will have just labels and ticks, no horizontal line
    yAxis.select(".domain").remove();

    //Dashed line: make .style("stroke-dasharray", ("3, 3"))
    }
    //Data: At MOST a month (15MB for all three sensors, 30s per measurement)
    //Default load one day of data, get more as required
    //downsample: 100 data points, take avg per each group
    //dot colors if there are points within group that exceed alarm limits (do last)
}
