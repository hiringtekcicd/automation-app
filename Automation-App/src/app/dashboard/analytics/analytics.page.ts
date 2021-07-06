import { VariableManagementService } from "./../../Services/variable-management.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Devices } from "./../../Services/variable-management.service";
@Component({
  selector: "app-analytics",
  templateUrl: "./analytics.page.html",
  styleUrls: ["./analytics.page.scss"],
})
export class AnalyticsPage implements OnInit {
  currentDevice: Devices;
  topicID: string;

  lastTimestamp: Date;
  firstTimestamp: Date;
  durationSeconds = 10 * 60; // 10 mins of data right now = 600 seconds

  //see control page - ngOnInit about getting device settings and then getting topicID
  constructor(
    private varman: VariableManagementService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
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
        console.warn("TopicID:", this.topicID); //this is debug; REMOVE BEFORE RELEASE
      } else {
        console.warn("No info about current device!");
      }
    });
    //last timestamp = right now. First timestamp = last timestamp minus duration
    this.lastTimestamp = new Date();
    this.firstTimestamp = new Date();
    this.firstTimestamp.setTime(this.firstTimestamp.getTime() - this.durationSeconds * 1000);

    this.varman
      .getHistoricData(this.topicID, this.firstTimestamp, this.lastTimestamp)
      .subscribe((result) => {
        console.warn(result); //this is the exact API response
        //distribute data to each sensor-graph obj
      });
  }
}
