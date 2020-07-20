import { Injectable } from "@angular/core";
import { Display } from "./dashboard/display";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { element } from 'protractor';

@Injectable({
  providedIn: "root",
})
export class VariableManagementService {
  public brief_info_array: grow_room[];

  public growRoomVariableDisplays: Display[] = [];
  public systemVariableDisplays: Display[] = [];

  public growRooms: string[] = [];
  public systems: string[] = [];

  public selectedGrowRoom = new BehaviorSubject<string>("");
  public selectedSystem = new BehaviorSubject<string>("");

  public systemSettings = new BehaviorSubject<system_settings[]>([]);
  public growRoomSettings = new BehaviorSubject<grow_room_settings[]>([]);
  public systemSettingsIndex;
  public growRoomSettingsIndex;

  constructor(private http: HttpClient) {}

  public fetchBotData(repeat: boolean) {
    // Pull Brief_Info Data from Database
    // Brief_Info is simply the data required for the dasboard page (number of growrooms, systems, and various sesnors the user has)
    if(this.growRooms.length == 0 || (this.growRooms != [] && repeat == true)){
      this.http
      .get<brief_info>("http://localhost:3000/brief_info")
      .subscribe((resData) => {
        this.brief_info_array = resData.brief_info;
        // Update growRooms Array
        this.growRooms = [];
        this.brief_info_array.forEach((element) => {
          this.growRooms.push(element.name);
        });
        // Update the active grow room and system to the first one in array
        this.updateVariables(null, null);
      });
    }
  }

  public updateVariables(growRoomID: string, systemID: string) {
    // Reset SystemVariableDisplays Array
    this.systemVariableDisplays = [];

    // Set default growRoom if growRoomID is null
    if (growRoomID == null) {
      growRoomID = this.growRooms[0];
    }

    const growRoomIndex = this.brief_info_array.findIndex(({name}) => name === growRoomID);

    // check if a new growroom is selected
    if(this.selectedGrowRoom.value != growRoomID){
      this.growRoomVariableDisplays = [];
      this.systems = [];
      // Push systemIDs into systems array
      this.brief_info_array[growRoomIndex].systems.forEach((element) => {
        this.systems.push(element.name);
      })   

      // Push grow room display information into growRoomVariableDisplays Array
      this.brief_info_array[growRoomIndex].growRoomVariables.forEach((element) => {
        this.growRoomVariableDisplays.push(
          new Display(
            element.name,
            element.desired_range_low.toString() + " - " + element.desired_range_high.toString(),
            element.target_value.toString()
          )
        );
      });
    }
    

    // set default systemID if systemID is null
    if (systemID == null) {
      systemID = this.systems[0];
    }

    // Push system display information into systemVariableDisplays Array
    const systemIndex = this.brief_info_array[growRoomIndex].systems.findIndex(({name}) => name === systemID);

    this.brief_info_array[growRoomIndex].systems[systemIndex].systemVariables.forEach((element) => {
      this.systemVariableDisplays.push(
        new Display(
          element.name,
          element.desired_range_low.toString() + " - " + element.desired_range_high.toString(),
          element.target_value.toString()
        )
      );
    });

    // Update the selected Grow Room and System
    this.selectedGrowRoom.next(growRoomID);
    this.selectedSystem.next(systemID);
  }

  // Post grow room and system settings to backend
  public postSettings(growRoomForm: any, systemForm: any){
    if(growRoomForm){
      console.log(growRoomForm);
      this.http.post("http://localhost:3000/grow_room_settings/" + this.selectedGrowRoom.value, growRoomForm).subscribe(resData => {console.log(resData)});
    }
    if(systemForm){
      this.http.post("http://localhost:3000/system_settings/" + this.selectedGrowRoom.value + "/" + this.selectedSystem.value, systemForm).subscribe(resData => {console.log(resData)});
    }
  }

  // Update grow room and system settings in backend
  public updateSettings(growRoomForm: any, systemForm: any){
    if(growRoomForm){
      this.http.put("http://localhost:3000/grow_room_settings/" + this.growRoomSettings.value[this.growRoomSettingsIndex]._id, growRoomForm).subscribe(resData => {console.log(resData)});
      // Update grow room settings locally 
      var tempGrowRoomSettings = this.growRoomSettings.value;
      tempGrowRoomSettings[this.growRoomSettingsIndex].settings = growRoomForm;
      this.growRoomSettings.next(tempGrowRoomSettings);
    }
    if(systemForm){
      this.http.put("http://localhost:3000/system_settings/" + this.systemSettings.value[this.systemSettingsIndex]._id, systemForm).subscribe(resData => {console.log(resData)});
      // Update system settings locally
      var tempSystemSettings = this.systemSettings.value;
      tempSystemSettings[this.systemSettingsIndex].settings = systemForm;
      this.systemSettings.next(tempSystemSettings);
    }
  }

  // Fetch grow room settings for current grow room
  public getGrowRoomSettings(){
    this.http.get<grow_room_settings>("http://localhost:3000/grow_room_settings/" + this.selectedGrowRoom.value).subscribe(resData => {
      var temp = this.growRoomSettings.value;
      temp.push(resData);
      this.growRoomSettings.next(temp);
      this.growRoomSettingsIndex = this.growRoomSettings.value.length - 1;
    });
  }

  // Fetch system settings for current system
  public getSystemSettings(){
    this.http.get<system_settings>("http://localhost:3000/system_settings/" + this.selectedGrowRoom.value + "/" + this.selectedSystem.value).subscribe(resData => {
      var temp = this.systemSettings.value;
      temp.push(resData);
      this.systemSettings.next(temp);
      this.systemSettingsIndex = this.systemSettings.value.length - 1;
    });
  }
}

// format of brief_info data coming from backend
interface brief_info {
  brief_info: [grow_room];
}

interface grow_room {
  _id: string;
  name: string;
  growRoomVariables: [sensor];
  systems: [systems];
  __v: 0;
}

interface systems {
  systemVariables: [sensor];
  _id: string;
  name: string;
}

interface sensor {
  _id: string;
  name: string;
  target_value: Number;
  desired_range_low: Number;
  desired_range_high: Number;
}

// Format of settings data coming from backend
interface system_settings {
  _id: string;
  growRoomID: string;
  systemID: string;
  settings: any;
}

interface grow_room_settings {
  _id: string;
  growRoomID: string;
  settings: any;
}
