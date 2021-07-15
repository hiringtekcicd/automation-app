import { analytics_data } from "./../../models/historical-data-interface";
import { AfterViewInit, Component, Input, OnInit } from "@angular/core";
import * as d3 from "d3";

@Component({
  selector: "sensor-graph",
  templateUrl: "./sensor-graph.component.html",
  styleUrls: ["./sensor-graph.component.scss"],
})
export class SensorGraphComponent implements OnInit, AfterViewInit {
  // Each instance of this uses D3JS to create a graph (inside an ionic card component).
  // When we are ready for actual data, have an @Input() to bind to a specific sensor
  @Input() _historicalData: analytics_data; //this is a reference to the analytics page data
  @Input() set historicalData(historicalData: analytics_data) {
    console.log("Setter called with ", historicalData);
    this._historicalData = historicalData;
    this.downsampleCompileData(5);
    console.warn("Compile in setter");
    this.buildGraph();
    console.warn("Build in setter");
  }
  @Input() sensorType: string;
  @Input() sensorDisplay: string;

  @Input() _timeframe: number;
  @Input() set timeframe(timeframe: number){
    this._timeframe = timeframe;
    this.buildGraph();
    console.warn("Build in timeframe setter");
  }

  aspectRatio = 500 / 225;
  dimensions = {
    width: 500,
    height: 225,
    margin: {
      top: 0,
      right: 0,
      bottom: 20,
      left: 40,
    },
    boundedWidth: 0,
    boundedHeight: 0,
  };

  sensorDataset: sensor_data_compiled[]; //compileData() will put a dataset here, which d3js will then use
  constructor() {}

  ngOnInit() {
    this.downsampleCompileData(5);
    console.warn("Compile In NgOnInit");
  }

  ngAfterViewInit() {
    this.buildGraph();
    console.warn("Build in AfterViewInit");
  }

  //had https://bl.ocks.org/mbostock/3883245
  //had https://www.d3-graph-gallery.com/graph/line_basic.html
  //observable, which also doesn't work https://observablehq.com/@d3/line-chart

  //Currently following https://vizartpandey.com/creating-simple-line-charts-using-d3-js-part-01/
  async buildGraph() {
    const dataset = this.sensorDataset;

    //X/Y access functions
    const yAccessor = (d) => +d.value; //This needs to be a number, not a string, otherwise scaling is weird
    const dateParser = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");
    const xAccessor = (d) => dateParser(d.timestamp);

    //Dimensions on page for the graph

    this.dimensions.boundedWidth =
      this.dimensions.width -
      this.dimensions.margin.left -
      this.dimensions.margin.right;
    this.dimensions.boundedHeight =
      this.dimensions.height -
      this.dimensions.margin.top -
      this.dimensions.margin.bottom;

    //Wrapper and bounds divs
    //const container = d3.select("#" + this.sensorType);
    //const wrapper = d3.select("#" + this.sensorType + "-svg");
    const bounds = d3
      .select("#" + this.sensorType + "-g")
      .style(
        "transform",
        `translate(${this.dimensions.margin.left}px,${this.dimensions.margin.top}px)`
      );

    //Scaling functions
    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(dataset, yAccessor))
      .range([this.dimensions.boundedHeight, 0]);

    //X Axis: setting the domain of the X Axis according to the date range, NOT based on the data.
    let currentDate = new Date(); //this is the current time anytime the page updates/refreshes
    let oldDate = new Date();
    oldDate.setTime(currentDate.getTime() - 1000 * 60 * 60 * this._timeframe); //current time minus hours * 60mins/hr * 60secs/min * 1000ms/s
    const xScale = d3
      .scaleTime()
      .domain([oldDate, currentDate]) //use time range
      .range([0, this.dimensions.boundedWidth]);

    //Line generation (data points)
    const lineGenerator = d3
      .line()
      .x((d) => xScale(xAccessor(d)))
      .y((d) => yScale(yAccessor(d)))
      .curve(d3.curveBasis);

    const line = bounds
      .append("path")
      .attr("d", lineGenerator(dataset))
      .attr("fill", "none")
      .attr("stroke", "Blue")
      .attr("stroke-width", 2);

    //Axes
    //Customization: see https://ghenshaw-work.medium.com/customizing-axes-in-d3-js-99d58863738b

    const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(5); //make sure there is enough margin so it doesn't cut off digits (margin left)
    const yAxis = bounds.append("g").call(yAxisGenerator);
    const xAxisGenerator = d3.axisBottom().scale(xScale);
    //xAxisGenerator.ticks(5); //Sets number of auto-gen'd ticks
    //xAxisGenerator.tickSize(-100); //negative tick size = grid-like, goes into the graph
    const xAxis = bounds
      .append("g")
      .style("transform", `translate(0px,${this.dimensions.boundedHeight}px)`) //make it an actual bottom x-axis
      .call(xAxisGenerator);
    xAxis.select(".domain").remove(); // Will have just labels and ticks, no horizontal line
    yAxis.select(".domain").remove();
    this.drawAlarmLine(true);
  }
  //downsample: 100 data points, take avg per each group
  //dot colors if there are points within group that exceed alarm limits (do last)

  drawAlarmLine(isRed: boolean) {
    const wrapper = d3.select("#" + this.sensorType + "-svg");
    wrapper
      .append("line")
      .style("stroke", isRed ? "red" : "grey")
      .style("stroke-dasharray", "3, 3") //Dashed line
      .attr("x1", this.dimensions.margin.left)
      .attr("y1", 10)
      .attr("x2", this.dimensions.width)
      .attr("y2", 10);
  }

  compileData() {
    this.sensorDataset = [];
    this._historicalData.sensor_info.map((element) => {
      let currentTime = element._id;
      let currentValue = element.sensors.find(
        (item) => item.name == this.sensorType
      ).value;
      this.sensorDataset.push({ timestamp: currentTime, value: +currentValue });
    });
    //console.warn(this.sensorDataset);
  }

  //Use whole numbers!!
  downsampleCompileData(ratio: number) {
    this.sensorDataset = [];
    let i = 0;
    let currentSum = 0;
    let firstGroupTimestamp: Date;
    if (this._historicalData) {
      //Check if there is data for this sensor. If there are none, quit it
      let firstElem = this._historicalData.sensor_info[0].sensors;
      let hasData = false;
      for(let element of firstElem){
        if(element.name == this.sensorType){
          hasData = true;
        }
      }
      if(!hasData) return; //return with empty dataset.

      for (let element of this._historicalData.sensor_info) {
        let currentValue = element.sensors.find(
          (item) => item.name == this.sensorType
        ).value;
        currentSum += +currentValue;
        if (i == ratio - 1) {
          //reached last element of the group, record it
          let avgValue = +currentSum / (i + 1);
          currentSum = 0;
          i = -1; //this means i will be 0 at end of loop
          this.sensorDataset.push({
            timestamp: firstGroupTimestamp,
            value: +avgValue,
          });
        } else if (i == 0) {
          //first run of the group, log the first timestamp
          firstGroupTimestamp = element._id;
        }
        i++;
      }
    }else{
      console.warn("downSample null historicalData!", this._historicalData);
    }

    //console.warn(this.sensorDataset);
  }
}

interface sensor_data_compiled {
  timestamp: Date;
  value: number;
}
