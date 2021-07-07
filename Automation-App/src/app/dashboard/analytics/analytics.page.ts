import { element } from 'protractor';
import { analytics_data } from "./../../models/historical-data-interface";
import { VariableManagementService } from "./../../Services/variable-management.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Devices } from './../../Services/variable-management.service';
@Component({
  selector: "app-analytics",
  templateUrl: "./analytics.page.html",
  styleUrls: ["./analytics.page.scss"],
})
export class AnalyticsPage implements OnInit {
  topicID: string;
  currentDevice: Devices;
  historicalData: analytics_data;

  lastTimestamp: Date;
  firstTimestamp: Date;
  durationSeconds = 10000 * 60; // 10 mins of data right now = 600 seconds

  existingSensors: string[]; //will contain list of sensor names that exist in the fetched data

  //see control page - ngOnInit about getting device settings and then getting topicID
  constructor(
    private varman: VariableManagementService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.existingSensors = [];
    //use queryParams to get topicID, then use that and a selected timespan to get data from varman (which gets it from the backend)
    this.route.queryParams.subscribe((params) => {
      let currentDeviceType = params["deviceType"];
      let currentDeviceIndex = params["deviceIndex"];

      if ((currentDeviceType && currentDeviceIndex) != null) {
        this.currentDevice = this.varman.getCurrentDeviceSettings(
          currentDeviceType,
          currentDeviceIndex
        );
        
        this.topicID = this.currentDevice.topicID;
      } else {
        console.warn("No info about current device!");
      }
    });
    //last timestamp = right now. First timestamp = last timestamp minus duration
    this.lastTimestamp = new Date();
    this.firstTimestamp = new Date();
    this.firstTimestamp.setTime(
      this.firstTimestamp.getTime() - this.durationSeconds * 1000
    );
    console.warn("before subscribe");
    this.varman
      .getHistoricData(this.topicID, this.firstTimestamp, this.lastTimestamp)
      .subscribe((result) => {
        this.historicalData = result;
        console.warn(result);
        if (this.historicalData.length > 0) {
          this.setCardFlags();
        }
      });
  }

  //uses fetched data to decide which sensor-graph components need to be displayed and calculate their data
  setCardFlags() {
    console.warn(this.currentDevice)
    this.existingSensors = Object.keys((this.currentDevice.settings))
    ///let sensorSample = this.historicalData.sensor_info[this.historicalData.sensor_info.length - 1].sensors; //this has array of sensor data with 'name': <type>
    //sensorSample.map((element) => {this.existingSensors.push(element.name)});
    console.warn(this.existingSensors);
  }
}
