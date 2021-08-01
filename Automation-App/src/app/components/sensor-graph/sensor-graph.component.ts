import { element } from "protractor";
import { analytics_data } from "./../../models/historical-data-interface";
import { AfterViewInit, Component, Input, OnInit } from "@angular/core";
import * as d3 from "d3";
import { Sensor } from "src/app/models/sensor.model";
@Component({
  selector: "sensor-graph",
  templateUrl: "./sensor-graph.component.html",
  styleUrls: ["./sensor-graph.component.scss"],
})
export class SensorGraphComponent implements OnInit, AfterViewInit {
  // Each instance of this uses D3JS to create a graph (inside an ionic card component).
  // When we are ready for actual data, have an @Input() to bind to a specific sensor
  _historicalData: analytics_data; //this is a reference to the analytics page data
  @Input() set historicalData(historicalData: analytics_data) {
    this._historicalData = historicalData;
    this.ngOnInit();
    this.ngAfterViewInit();
  }
  @Input() sensorType: string;

  _timeframe: number;
  @Input() set timeframe(timeframe: number) {
    this._timeframe = timeframe;
  }

  @Input() sensor: Sensor; //We need to bind to a sensor to get alarm info anyway, and we can also get DisplayName

  SECONDS_PER_DATA = 10;
  YSCALE_SPACE_PCT = 0.1; // Y scaling: percentage of space left empty both above and below the min/max pts of the graph. Valid between 0 and 0.5.

  aspectRatio = 500 / 300;
  dimensions = {
    width: 500,
    height: 300,
    margin: {
      top: 50,
      right: 0,
      bottom: 25,
      left: 50,
    },
    boundedWidth: 0,
    boundedHeight: 0,
  };

  sensorDataset: sensor_data_compiled[]; //compileData() will put a dataset here, which d3js will then use
  constructor() {}

  ngOnInit() {
    this.downsampleCompileData(500);
  }

  ngAfterViewInit() {
    this.buildGraph();
  }

  //had https://bl.ocks.org/mbostock/3883245
  //had https://www.d3-graph-gallery.com/graph/line_basic.html
  //observable, which also doesn't work https://observablehq.com/@d3/line-chart

  //Currently following https://vizartpandey.com/creating-simple-line-charts-using-d3-js-part-01/
  async buildGraph() {
    if (this.sensorDataset.length == 0) return;
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
    const wrapper = d3.select("#" + this.sensorType + "-svg");
    const bounds = d3
      .select("#" + this.sensorType + "-g")
      .style(
        "transform",
        `translate(${this.dimensions.margin.left}px,${this.dimensions.margin.top}px)`
      );

    const title = wrapper
      .append("text")
      .attr("x", this.dimensions.width / 2)
      .attr("y", 30)
      .style("font-size", "25px")
      .style("text-decoration", "bold")
      .style("text-anchor", "middle")
      .text(this.sensor.getDisplayName()); //All sensors that extend Sensor have this function, but sensor model ts does not. This will show errors but will run fine.

    //Scaling functions

    //y Scaling: an equal amount percentage of space left empty above/below the min/max of data.

    const YSCALE_REMAIN_PCT = 1 - 2 * this.YSCALE_SPACE_PCT; //Pct of screen left for data

    const extentData = d3.extent(dataset, yAccessor);
    const extentRange = extentData[1] - extentData[0];
    extentData[0] -= (extentRange / YSCALE_REMAIN_PCT) * this.YSCALE_SPACE_PCT;
    extentData[1] += (extentRange / YSCALE_REMAIN_PCT) * this.YSCALE_SPACE_PCT;
    const yScale = d3
      .scaleLinear()
      .domain(extentData)
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
      .y((d) => yScale(yAccessor(d)));
    //.curve(d3.curveBasis);
    let minAlarmPoints = [
      { x: 0, y: this.sensor.alarm_min },
      { x: this.dimensions.boundedWidth, y: this.sensor.alarm_min },
    ];
    let maxAlarmPoints = [
      { x: 0, y: this.sensor.alarm_max },
      { x: this.dimensions.boundedWidth, y: this.sensor.alarm_max },
    ];
    const alarmLineGen = d3 //using d3's own line() function so that generated lines would scale properly
      .line()
      .x((d) => d.x)
      .y((d) => yScale(d.y));
    const alarmLineMin = bounds
      .append("path")
      .attr("d", alarmLineGen(minAlarmPoints))
      .style("stroke", "red")
      .style("stroke-dasharray", "3, 3");
    const alarmLineMax = bounds
      .append("path")
      .attr("d", alarmLineGen(maxAlarmPoints))
      .style("stroke", "red")
      .style("stroke-dasharray", "3, 3");

    const line = bounds
      .append("path")
      .attr("d", lineGenerator(dataset))
      .attr("fill", "none")
      .attr("stroke", "Blue")
      .attr("stroke-width", 2);

    //Axes
    //Customization: see https://ghenshaw-work.medium.com/customizing-axes-in-d3-js-99d58863738b
    //.tickValues([..., ..., ...]) sets actual tick values (called on Axis generator)
    //.tick(num) sets number of ticks present on an axis (called on Axis generator)

    const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(5);
    const yAxis = bounds
      .append("g")
      .attr("id", "yAxis" + this.sensorType)
      .call(yAxisGenerator);
    const xAxisGenerator = d3.axisBottom().scale(xScale).ticks(7);

    const xAxis = bounds
      .append("g")
      .style("transform", `translate(0px,${this.dimensions.boundedHeight}px)`) //make it an actual bottom x-axis by translating it down
      .attr("id", "xAxis" + this.sensorType)
      .call(xAxisGenerator);

    //xAxis.select(".domain").remove(); //Removes axes' horizontal line
    //yAxis.select(".domain").remove();

    //const firstTick = d3.select("#xAxis" + this.sensorType).select("g").remove(); //selects the first tick of the xAxis

    const modifyXAxisText = d3
      .select("#xAxis" + this.sensorType)
      .selectAll(".tick text")
      .style("transform", "translate(0px, 5px)")
      .style("font-size", "150%"); //moves all xAxis text down a bit
    const modifyYAxisText = d3
      .select("#yAxis" + this.sensorType)
      .selectAll(".tick text")
      .style("font-size", "150%");
    //.style("transform", "rotate(90deg) translate(22px, -12px)") //makes the axis text vertical (looks bad)
    //Don't forget to change bottom or left margins in this.dimensions
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
  //Specify a desired amount of points left over on the display after downsampling.
  //This function does not use the ACTUAL number of data points available, but instead uses the THEORETICAL amount of points in the time period selected.
  downsampleCompileData(targetPts: number) {
    this.sensorDataset = [];
    let i = 0;
    let currentSum = 0;
    let firstGroupTimestamp: Date;
    if (!this._historicalData) {
      console.warn("downSample null historicalData!", this._historicalData);
      return;
    }
    //Check if there is data for this sensor. If there are none, quit it
    let firstElem = this._historicalData.sensor_info[0].sensors;
    let hasData = false;
    for (let element of firstElem) {
      if (element.name == this.sensorType) {
        hasData = true;
      }
    }
    if (!hasData) return; //return with empty dataset.

    let theoreticalPts = (this._timeframe * 3600) / this.SECONDS_PER_DATA; //total seconds divided by num seconds per data point = theoretical num of pts
    let ratio = theoreticalPts / targetPts;
    if (ratio <= 1) ratio = 1; //If there are less theoretical points than target, leave it be
    ratio = Math.round(ratio);

    if (ratio == 1) {
      for (let element of this._historicalData.sensor_info) {
        let currentValue = element.sensors.find(
          (item) => item.name == this.sensorType
        ).value;
        this.sensorDataset.push({
          timestamp: element._id,
          value: +currentValue,
        });
      }
      return;
    }
    //For loop: computes average per every [ratio] number of samples, averages them down.
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
    if (i != 0) {
      //this means the for loop ended in the middle of a group. Make this into one final data point
      let avgValue = +currentSum / (i + 1);
      this.sensorDataset.push({
        timestamp: firstGroupTimestamp,
        value: +avgValue,
      });
    }
  }
}

interface sensor_data_compiled {
  timestamp: Date;
  value: number;
}
