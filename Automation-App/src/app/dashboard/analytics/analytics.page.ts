import { element } from 'protractor';
import { analytics_data } from "./../../models/historical-data-interface";
import { VariableManagementService } from "./../../Services/variable-management.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Devices, FertigationSystemString } from './../../Services/variable-management.service';
@Component({
  selector: "app-analytics",
  templateUrl: "./analytics.page.html",
  styleUrls: ["./analytics.page.scss"],
})
export class AnalyticsPage implements OnInit {
  topicID: string;
  currentDevice: Devices;
  historicalData: analytics_data;

  existingSensors: string[]; //will contain list of sensor names that exist in the fetched data

  deviceIsFertigation: boolean; //Since the text for fert/clim systems is hard to get to from a *ngIf directive, store this in a boolean and make it read from that

  //Timeframe options dropdown: See https://forum.ionicframework.com/t/ion-select-and-default-values-ionic-4-solved/177550/2
  timeframeOptions = [ //Insert more timeframe options as needed in the future.
    {value: 1, label: "1 Hour"},
    {value: 6, label: "6 Hours"},
    {value: 12, label: "12 Hours"},
    {value: 24, label: "1 Day"},
    {value: 168, label: "1 Week"},
    {value: 744, label: "1 Month"}, //31 days
    {value: 2232, label: "3 Months"} //93 days
  ];
  defaultTimeframeValue = 1; //default to 1 hr
  currentTimeframeValue = 1;

  onSelectChange(event: any){
    console.log("Select changed to", event.detail.value);
    this.currentTimeframeValue = event.detail.value;
    this.fetchHistoricData(this.currentTimeframeValue);
  }


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

        if(currentDeviceType == FertigationSystemString){
          this.deviceIsFertigation = true; //we could shortcut this but eh
        }else{
          this.deviceIsFertigation = false;
        }

        this.currentDevice = this.varman.getCurrentDeviceSettings(
          currentDeviceType,
          currentDeviceIndex
        );
        
        this.topicID = this.currentDevice.topicID;
        this.topicID = "9f4ZD";
      } else {
        console.warn("No info about current device!");
      }
    });
    //last timestamp = right now. First timestamp = last timestamp minus duration
    this.fetchHistoricData(this.currentTimeframeValue);
  }

  //uses fetched data to decide which sensor-graph components need to be displayed and calculate their data
  setCardFlags() {
    console.warn(this.currentDevice)
    this.existingSensors = Object.keys((this.currentDevice.settings))
    ///let sensorSample = this.historicalData.sensor_info[this.historicalData.sensor_info.length - 1].sensors; //this has array of sensor data with 'name': <type>
    //sensorSample.map((element) => {this.existingSensors.push(element.name)});
    console.warn(this.existingSensors);
  }

  fetchHistoricData(durationHrs: number){
    let lastTimestamp = new Date();
    let firstTimestamp = new Date();
    firstTimestamp.setTime(
      firstTimestamp.getTime() - durationHrs * 60 * 60 * 1000 //3600 secs in hour * 1000ms in sec
    );
    this.varman
      .getHistoricData(this.topicID, firstTimestamp, lastTimestamp)
      .subscribe((result) => {
        this.historicalData = result;
        console.warn("Fetched for",durationHrs,"hours:", result);
        if (this.historicalData.length > 0) {
          this.setCardFlags();
        }else{
          this.existingSensors = null;
        }
      });
  }
}
