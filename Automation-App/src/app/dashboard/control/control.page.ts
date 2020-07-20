import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { VariableManagementService } from 'src/app/variable-management.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { skipWhile } from 'rxjs/operators';

@Component({
  selector: 'app-control',
  templateUrl: './control.page.html',
  styleUrls: ['./control.page.scss'],
})
export class ControlPage implements OnInit {
  
  settingsForm: FormGroup
  growRoomForm: FormGroup = new FormGroup({});
  systemsForm: FormGroup = new FormGroup({});

  systemID: string;
  growRoomID: string;

  ph: boolean = false;
  ec: boolean = false;
  water_temperature: boolean = false;

  humidity: boolean = false;
  air_temperature: boolean = false;


  systemAlertOptions: any = {
    header: "System Name"
  }

  growRoomAlertOptions: any = {
    header: "Grow Room Name"
  }

  constructor(public variableManagementService: VariableManagementService, private fb: FormBuilder, private changeDetector: ChangeDetectorRef) { 
    this.variableManagementService.fetchBotData(false);
    this.settingsForm = new FormGroup({
      systemSettings: this.systemsForm,
      growRoomSettings: this.growRoomForm
    });
  }

  ngOnInit() {
    // Respond to grow room settings data fetched from backend
    this.variableManagementService.growRoomSettings.pipe(skipWhile(arr => arr.length == 0)).subscribe(resData => {
      //Reset systems Form and populate control fields with settings data
      this.growRoomForm.reset();
      this.growRoomForm.patchValue(resData[this.variableManagementService.growRoomSettings.value.length - 1].settings);
    });

    // Respond to system settings data fetched from backend
    this.variableManagementService.systemSettings.pipe(skipWhile(arr => arr.length == 0)).subscribe(resData => {
      //Reset grow room Form and populate control fields with settings data
      this.systemsForm.reset();
      this.systemsForm.patchValue(resData[this.variableManagementService.systemSettings.value.length - 1].settings);
    });

    // Subscribe to changes in System ID
    this.variableManagementService.selectedSystem.pipe(skipWhile(str => str == "")).subscribe(resData => {
      // Delete exisiting sensor cards
      this.resetSystem();
      this.systemID = resData;
      // add sensor cards based on sensors for system
      this.variableManagementService.systemVariableDisplays.forEach((element) => {
        switch(element.title) {
          case "ph":
            this.ph = true;
            break;
          case "ec":
            this.ec = true;
            break;
          case "water temp":
            this.water_temperature = true;
            break;
        }
      });
      // Detect and update UI
      this.changeDetector.detectChanges();
      // Check if settings data is already stored locally
      var dataFound = this.variableManagementService.systemSettings.value.some((element, index) => {
        this.variableManagementService.systemSettingsIndex = index;
        return this.systemID == element.systemID && this.growRoomID == element.growRoomID;
      });
      // If data is stored locally populate systems form with settings data
      // If data isn't found locally fetch it from backend
      if(dataFound){
        this.systemsForm.patchValue(this.variableManagementService.systemSettings.value[this.variableManagementService.systemSettingsIndex].settings);
      } else {
        this.variableManagementService.getSystemSettings();
      }
    });
    
    // Update GrowRoom ID selection
    this.variableManagementService.selectedGrowRoom.pipe(skipWhile(str => str == "")).subscribe(resData => {
      // Delete exisiting sensor cards
      this.resetGrowRoom();
      this.growRoomID = resData;
      // add sensor cards based on sensors for grow room
      this.variableManagementService.growRoomVariableDisplays.forEach((element) => {
        switch(element.title) {
          case "humidity":
            this.humidity = true;
            break;
          case "air temp":
            this.air_temperature = true;
            break;
        }
      });
      // Detect and update UI
      this.changeDetector.detectChanges();
      // Check if settings data is already stored locally   
      var dataFound = this.variableManagementService.growRoomSettings.value.some((element, index) => {
        this.variableManagementService.growRoomSettingsIndex = index;
        return this.growRoomID == element.growRoomID;
      });
      // If data is stored locally populate systems form with grow room data
      // If data isn't found locally fetch it from backend
      if(dataFound){
        this.growRoomForm.patchValue(this.variableManagementService.growRoomSettings.value[this.variableManagementService.growRoomSettingsIndex].settings);
        
      } else {
        this.variableManagementService.getGrowRoomSettings();
      }     
    });
  }

  // Change System 
  changeSystem(systemName : string){
    this.variableManagementService.updateVariables(this.growRoomID, systemName);
  }

  // Change Grow Room
  changeGrowRoom(growRoomName: string){
    this.variableManagementService.updateVariables(growRoomName, null);
  }
  
  // update data in backend
  pushData(){
    if(this.systemsForm.dirty && !this.growRoomForm.dirty){
      this.variableManagementService.updateSettings(null, this.systemsForm.value);
    } else if(!this.systemsForm.dirty && this.growRoomForm.dirty){
      this.variableManagementService.updateSettings(this.growRoomForm.value, null);
    } else {
      this.variableManagementService.updateSettings(this.growRoomForm.value, this.systemsForm.value);
    }
  }

  // delete grow room sensor cards 
  resetGrowRoom(){
    this.humidity = false;
    this.air_temperature = false;
    this.growRoomForm.reset();
    this.changeDetector.detectChanges();
  }

  // delete system sensor cards 
  resetSystem(){
    this.ph = false;
    this.ec = false;
    this.water_temperature = false;
    this.systemsForm.reset();
    this.changeDetector.detectChanges();
  }
}
