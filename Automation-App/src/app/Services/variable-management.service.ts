import {
  sensor_data,
  analytics_data,
} from "./../models/historical-data-interface";
import { Injectable } from "@angular/core";
import { Display } from "../dashboard/display";

import { BehaviorSubject, forkJoin, Observable, of, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { first, map, switchMap, tap } from "rxjs/operators";
import * as _ from "lodash";
import { FertigationSystem } from "../models/fertigation-system.model";
import { ClimateController } from "../models/climate-controller.model";
import { IonicStorageService } from "./ionic-storage.service";
import { reduce } from "lodash";

@Injectable({
  providedIn: "root",
})
export class VariableManagementService {
  private dbURL;

  public fertigationSystemSettings = new BehaviorSubject<FertigationSystem[]>(
    null
  );
  public climateControllerSettings = new BehaviorSubject<ClimateController[]>(
    null
  );

  public start_date: string;
  public end_date: string;

  public labelDate: string;

  public on_update = new Subject();

  public growRooms: string[] = [];
  public systems: string[] = [];
  public sensorsTimeData: string[] = [];
  public sensorsValueData: number[] = [];
  public phValueData: number[] = [];
  public ecValueData: number[] = [];

  // public clusters: cluster[] = [];
  public clusterNames: string[] = [];
  public sensorDisplays: Display[] = [];
  public selectedCluster = new BehaviorSubject<string>(null);
  public selectedDevice = new BehaviorSubject<string>(null);
  public devices: string[] = [];

  public deviceSettingsSubject = new Subject();
  public deviceSettings: device_settings[] = [];
  public deviceSettingsIndex: number;

  public noClusters: boolean = true;
  public noDevices: boolean = true;

  public plants: plant[] = [];

  public analyticsDataArray;

  constructor(
    private http: HttpClient,
    private storageService: IonicStorageService
  ) {
    this.fertigationSystemSettings.subscribe((fertigationSystemArray) => {
      if (fertigationSystemArray) {
        storageService.set("fertigationSystems", fertigationSystemArray);
      }
    });
    this.climateControllerSettings.subscribe((climateControllerArray) => {
      if (climateControllerArray) {
        storageService.set("climateControllers", climateControllerArray);
      }
    });
  }
  // Omkar's previous code
  //public sensor_data_array: sensor_data[];
  //
  //public all_sensor_data_array: sensor_data[];
  // public getSensorData(){
  //   this.sensorsTimeData=[];
  //   this.sensorsValueData=[];
  //   this.http
  //     .get<sensor_info>("http://localhost:3000/sensors_data/GrowRoom1/system1/ph")
  //     .subscribe((resData) => {

  //       //console.log(resData.sensor_info);
  //       this.sensor_data_array = resData.sensor_info;

  //       //console.log(this.sensor_data_array);
  //       for(var i=0;i<this.sensor_data_array.length;i++)
  //       {
  //         //this.sensor_data_array[i]._id['name']==
  //         this.sensorsTimeData.push(this.sensor_data_array[i]._id['time'])
  //         this.sensorsValueData.push(parseFloat(this.sensor_data_array[i]._id['value']))
  //       }
  //       // return this.sensorsValueData;
  //     });
  //     return [this.sensorsValueData,this.sensorsTimeData];
  //     //console.log(this.sensorsValueData);
  // }

  // Post grow room and system settings to backend
  public createGrowRoom(growRoomForm: any): Observable<any> {
    var sensorsArray = [];
    for (var key in growRoomForm.sensors) {
      sensorsArray.push({
        name: key,
        monitoring_only: growRoomForm.sensors[key].monitoring_only,
        day_and_night: growRoomForm.sensors[key].monitoring_only
          ? null
          : growRoomForm.sensors[key].control.day_and_night,
        target_value: growRoomForm.sensors[key].monitoring_only
          ? null
          : growRoomForm.sensors[key].control.target_value,
        day_target_value: growRoomForm.sensors[key].monitoring_only
          ? null
          : growRoomForm.sensors[key].control.day_and_night
          ? growRoomForm.sensors[key].control.day_target_value
          : null,
        night_target_value: growRoomForm.sensors[key].monitoring_only
          ? null
          : growRoomForm.sensors[key].control.day_and_night
          ? growRoomForm.sensors[key].control.night_target_value
          : null,
        desired_range_low: growRoomForm.sensors[key].alarm_min,
        desired_range_high: growRoomForm.sensors[key].alarm_max,
      });
    }
    var data = {
      name: growRoomForm.grow_room_name,
      cluster_name: growRoomForm.cluster_name,
      settings: growRoomForm.sensors,
      brief_info: sensorsArray,
    };
    return this.http.post(this.dbURL + "/create_grow_room/", data).pipe(
      map((resData: { _id: string }) => {
        this.deviceSettings.push({
          _id: resData._id,
          name: data.name,
          type: "growroom",
          clusterName: data.cluster_name,
          settings: data.settings,
        });
        this.noDevices = false;
        // const clusterIndex = this.clusters.findIndex(({name}) => name === data.cluster_name);
        // this.clusters[clusterIndex].growRoom = {
        //   name: data.name,
        //   growRoomVariables: data.brief_info
        // };
        // this.devices.push(data.name);
        // this.updateCurrentCluster(data.cluster_name, data.name);
      })
    );
  }

  public createFertigationSystem(
    fertigationSystem: FertigationSystem
  ): Observable<any> {
    return this.http
      .post(
        this.dbURL + "/fertigation-system-settings/create",
        fertigationSystem
      )
      .pipe(
        map((resData: { _id: string }) => {
          console.log(resData);
          fertigationSystem._id = resData._id;
          let fertigationDevicesArray: FertigationSystem[] =
            this.fertigationSystemSettings.value;
          fertigationDevicesArray.push(fertigationSystem);
          this.fertigationSystemSettings.next(fertigationDevicesArray);
        })
      );
  }

  // Update grow room and system settings in backend
  public updateDeviceSettings(
    device: Devices,
    deviceType: string,
    deviceID: string,
    deviceIndex: number
  ): Observable<any> {
    let endPointURL = "";
    let localStorageKey = "";
    let deviceSubject: BehaviorSubject<Devices[]>;
    console.log(deviceType);
    switch (deviceType) {
      case FertigationSystemString:
        localStorageKey = "fertigationSystems";
        endPointURL = FertigationSystemString;
        deviceSubject = this.fertigationSystemSettings;
        break;
      case ClimateControllerString:
        localStorageKey = "climateControllers";
        endPointURL = ClimateControllerString;
        deviceSubject = this.climateControllerSettings;
        break;
      // TODO Add error checking
    }
    return this.http
      .put(
        this.dbURL + "/" + endPointURL + "-settings/update/" + deviceID,
        device
      )
      .pipe(
        switchMap(() => {
          let updatedDevicesArray = deviceSubject.value;
          console.log(device);
          updatedDevicesArray[deviceIndex] = device;
          return this.storageService
            .set(localStorageKey, updatedDevicesArray)
            .pipe(
              tap(() => {
                deviceSubject.next(updatedDevicesArray);
                console.log(deviceSubject.value);
              })
            );
        })
      );
  }

  public setRESTServerURL(ip: string) {
    this.dbURL = "http://" + ip;
  }

  public fetchDevices() {
    let $fertigationSystems: Observable<FertigationSystem[]> =
      this.storageService.get("fertigationSystems");
    let $climateControllers: Observable<ClimateController[]> =
      this.storageService.get("climateControllers");

    return forkJoin([$fertigationSystems, $climateControllers]).pipe(
      switchMap((settings) => {
        let settingsObservables: [
          Observable<FertigationSystem[]>,
          Observable<ClimateController[]>
        ] = [null, null];
        if (settings[0]) {
          settingsObservables[0] = of(settings[0]);
        } else {
          settingsObservables[0] = this.http
            .get<FertigationSystem[]>(
              this.dbURL + "/fertigation-system-settings/find"
            )
            .pipe(
              tap((data) => {
                console.log(data);
                this.storageService.set("fertigationSystems", data);
              })
            );
        }

        if (settings[1]) {
          settingsObservables[1] = of(settings[1]);
        } else {
          settingsObservables[1] = this.http
            .get<ClimateController[]>(
              this.dbURL + "/climate-controller-settings/find"
            )
            .pipe(
              tap((data) => {
                this.storageService.set("climateControllers", data);
              })
            );
        }

        return forkJoin(settingsObservables);
      }),
      tap((settings) => {
        console.log(settings);
        const fertigationSystemsDeserialized = settings[0].map(
          (fertigationSystemJSON) =>
            new FertigationSystem().deserialize(fertigationSystemJSON)
        );
        const climateControllerDeserialized = settings[1].map(
          (climateControllerJSON) =>
            new ClimateController().deserialize(climateControllerJSON)
        );

        this.fertigationSystemSettings.next(fertigationSystemsDeserialized);
        this.climateControllerSettings.next(climateControllerDeserialized);
        console.log(this.fertigationSystemSettings.value);
      })
    );
  }

  public getCurrentDeviceSettings(
    currentDeviceType: string,
    currentDeviceIndex: number
  ): Devices {
    switch (currentDeviceType) {
      case FertigationSystemString:
        return this.fertigationSystemSettings.value[currentDeviceIndex];
      case ClimateControllerString:
        return this.climateControllerSettings.value[currentDeviceIndex];
      default:
        // TODO add error handling code
        return null;
    }
  }

  public getDeviceTopicIds(): string[] {
    let deviceTopicIds: string[] = [];
    this.fertigationSystemSettings.value.forEach((element) => {
      deviceTopicIds.push(element.topicID);
    });
    this.climateControllerSettings.value.forEach((element) => {
      deviceTopicIds.push(element.topicID);
    });
    return deviceTopicIds;
  }

  public getPlants() {
    return this.http.get<plant[]>(this.dbURL + "/get_plants").pipe(
      map((plants) => {
        this.plants = plants;
      })
    );
  }
  //---------------------------------------------Analytics page - historic data management------------------------------------------------
  //this is only called on page change
  public getHistoricData(
    topicID: string,
    firstTimestamp: Date,
    lastTimestamp: Date
  ): Observable<analytics_data> {
    //Check if array itself exists (if not, initialize)
    if (!this.analyticsDataArray) this.analyticsDataArray = [];
    //Check if item exists (disregarding timeframe)
    let currentTarget = this.analyticsDataArray.find(
      (item) => item.topicID == topicID
    );
    if (!currentTarget) {
      this.analyticsDataArray.push({ topicID: topicID, analyticsData: this.makeAnalyticsData(null) });
      console.log("Case 1: no current entry");
    } else {
      //What if the data is already there, all of it? return the data in of()
      let currentAData: analytics_data = currentTarget.analyticsData;
      if (currentAData && currentAData.length > 0) {//checking null
        let firstTimestampDate = new Date(currentAData.firstTimestamp);
        let lastTimestampDate = new Date(currentAData.lastTimestamp);
        if (
          firstTimestampDate.getTime() <= firstTimestamp.getTime() &&
          lastTimestampDate.getTime() >= lastTimestamp.getTime()
        ) {
          console.log("Case 2: entry exists, returning slice");
          //Slice the data and return it since we have it already
          return of(this.getSlice(topicID, firstTimestamp));
        }
      }
    }
    //Here, case 2 is not met, meaning we have partial match
    //updateHistoricalDataStorage should return an Observable, which is returned to analytics page where it is subscribed
    return this.updateHistoricalDataStorage(topicID, firstTimestamp);
  }

  //Takes current value of the behaviorsubject, and 'patches' it with data from the backend to make it store from
  //firstTimestamp til now (new Date() ).
  private updateHistoricalDataStorage(topicID: string, earliestTargetDate: Date) : Observable<analytics_data>{
    let currentTargetDate = new Date();
    let currentAData: analytics_data = this.analyticsDataArray.find(
      (item) => item.topicID == topicID
    ).analyticsData; //this should be the subject?
    console.warn("Current target AData", currentAData);
    if (!currentAData || currentAData.length == 0) {
      console.log("Case 3: Data null, fetching all data");
      //no data cached or just created. Fetch the full thing
      return this.http
        .get<analytics_data>(
          this.dbURL +
            "/get_sensor_data/" +
            topicID +
            "/" +
            earliestTargetDate.toISOString() +
            "/" +
            currentTargetDate.toISOString()
        )
        .pipe(
          tap((resData) => {
            console.warn("Case 3: fetched",resData);
            this.analyticsDataArray.find(
              (item) => item.topicID == topicID
            ).analyticsData = { ...resData }; //both are the same type, so just store it
            //No need to map it, just store it; obs returned is the http request
            //No need to slice because this is a request for exact amount needed
          })
        );
    } else {
      //Append at front, back, or both?
      let currentDataEarliestDate = new Date(currentAData.firstTimestamp);
      let currentDataLatestDate = new Date(currentAData.lastTimestamp);
      let frontFlag: boolean =
      currentDataEarliestDate.getTime() <= earliestTargetDate.getTime();
      let backFlag: boolean =
      currentDataLatestDate.getTime() >= currentTargetDate.getTime();
      //Flag is true -> do not fetch, Flag false -> send request to patch cache
      console.log(currentDataEarliestDate, earliestTargetDate, currentDataLatestDate, currentTargetDate);
      if (!frontFlag && !backFlag) {
        console.log("Case 4: Back and front append to array");
        //Data missing at both ends!
        let frontReq = this.http.get<analytics_data>(
          this.dbURL +
            "/get_sensor_data/" +
            topicID +
            "/" +
            earliestTargetDate.toISOString() +
            "/" +
            currentAData.firstTimestamp
        ); //fetch the difference
        let backReq = this.http.get<analytics_data>(
          this.dbURL +
            "/get_sensor_data/" +
            topicID +
            "/" +
            currentAData.lastTimestamp+
            "/" +
            currentTargetDate.toISOString()
        );
        return forkJoin([frontReq, backReq]).pipe(
          switchMap((resData) => {
            this.analyticsDataArray.find(
              (item) => item.topicID == topicID
            ).analyticsData = this.makeAnalyticsData([
              ...resData[0].sensor_info,
              ...currentAData.sensor_info,
              ...resData[1].sensor_info,
            ]);
            return of(this.getSlice(topicID, earliestTargetDate));
          })
        ); //[0] is front, [1] is back.
      } else if (!frontFlag && backFlag) {
        //append at front only
        console.log("Case 5: Just append earlier data");
        return this.http
          .get<analytics_data>(
            this.dbURL +
              "/get_sensor_data/" +
              topicID +
              "/" +
              earliestTargetDate.toISOString() +
              "/" +
              currentAData.firstTimestamp
          )
          .pipe(
            map((resData) => {
              this.analyticsDataArray.find(
                (item) => item.topicID == topicID
              ).analyticsData = this.makeAnalyticsData([
                ...resData.sensor_info,
                ...currentAData.sensor_info,
              ]);
              return (this.getSlice(topicID, earliestTargetDate));
            })
          );
      } else if (!backFlag && frontFlag) {
        console.log("Case 6: Just append latest");
        return this.http
          .get<analytics_data>(
            this.dbURL +
              "/get_sensor_data/" +
              topicID +
              "/" +
              currentAData.lastTimestamp +
              "/" +
              currentTargetDate.toISOString()
          )
          .pipe(
            map((resData) => {
              this.analyticsDataArray.find(
                (item) => item.topicID == topicID
              ).analyticsData = this.makeAnalyticsData([
                ...currentAData.sensor_info,
                ...resData.sensor_info,
              ]);
              return (this.getSlice(topicID, earliestTargetDate));
            })
          );
      }else{
        console.log("How did we get here?");
      }
    }
    //We ASSUME that the data previously fetched is in 1 contiguous chunk (a.k.a. if there is anything cached, there are no holes inside making us fetch for a tiny period of time).
    //This is for simplicity, and also just because this is how the backend works - it returns the whole span of data.
  }

  private getSlice(topicID: string, firstTimestamp: Date){
    //Gets the cached data and returns the portion that ranges from firstTimestamp to now
    let lastTimestamp = new Date();
    let currentAData = this.analyticsDataArray.find(
      (item) => item.topicID == topicID
    ).analyticsData;
    console.log("Slice from: ", currentAData);

    let firstIdx = currentAData.sensor_info.findIndex(
      (item) => item._id == firstTimestamp
    );
    let lastIdx = currentAData.sensor_info.findIndex(
      (item) => item._id == lastTimestamp
    );
    // firstTimestampDate.getTime() <= firstTimestamp.getTime() &&
    //lastTimestampDate.getTime() >= lastTimestamp.getTime()
      
    let resultArray: sensor_data[] = currentAData.sensor_info.slice(
      firstIdx,
      lastIdx + 1
    );
    return this.makeAnalyticsData(resultArray);
  }

  private makeAnalyticsData(sensorInfoArr: sensor_data[]){
    let result: analytics_data = {
      firstTimestamp: null,
      lastTimestamp: null,
      length: 0,
      sensor_info: [],
    };
    if(!sensorInfoArr || sensorInfoArr.length == 0) return result; //null/no data

    result.sensor_info = sensorInfoArr;
    result.firstTimestamp = sensorInfoArr[0]._id;
    result.lastTimestamp = sensorInfoArr[sensorInfoArr.length-1]._id;
    result.length = sensorInfoArr.length;
    return result;
  }
}

// format of brief_info data coming from backend

export const FertigationSystemString = "fertigation-system";
export const ClimateControllerString = "climate-controller";

export type Devices = FertigationSystem | ClimateController;

// Format of settings data coming from backend

interface device_settings {
  _id: string;
  name: string;
  type: string;
  clusterName: string;
  settings: any;
}

interface plant_settings {
  alarm_min: Number;
  alarm_max: Number;
  target_value: Number;
  day_and_night: Boolean;
  day_target_value: Number;
  night_target_value: Number;
}

export interface plant {
  _id: string;
  name: string;
  settings: {
    air_temperature: plant_settings;
    humidity: plant_settings;
    ec: plant_settings;
    ph: plant_settings;
    water_temperature: plant_settings;
  };
}
