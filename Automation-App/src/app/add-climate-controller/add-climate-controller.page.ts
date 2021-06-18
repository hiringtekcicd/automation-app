import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { VariableManagementService } from '../Services/variable-management.service';
import { plant } from '../Services/variable-management.service';
import { Router } from '@angular/router';
import { MqttInterfaceService } from '../Services/mqtt-interface.service';

@Component({
  selector: 'add-climate-controller',
  templateUrl: './add-climate-controller.page.html',
  styleUrls: ['./add-climate-controller.page.scss'],
})
export class AddClimateControllerPage implements OnInit {

  humidity: boolean = true;
  air_temperature: boolean = true;
  clusters: string[];
  plantName: string;

  climateControllerForm: FormGroup = new FormGroup({});
  sensorsForm: FormGroup = new FormGroup({});
  
  plantAlertOptions: any = {
    header: "Plant Name"
  }

  isLoading: boolean = false;

  constructor(private router: Router, public variableManagementService: VariableManagementService, private fb: FormBuilder, private mqttInterfaceService: MqttInterfaceService) { 
    if(this.variableManagementService.plants.length == 0){
      this.isLoading = true;
      this.variableManagementService.getPlants().subscribe(() => {
        this.isLoading = false;
      });
    } else {
      this.isLoading = false;
    }
    this.climateControllerForm = this.fb.group({
      'grow_room_name': this.fb.control(null),
      'cluster_name': this.fb.control(null),
      'plant_name': this.fb.control(null),
      'sensors': this.sensorsForm
    });
  }

  ngOnInit() {}

  onSubmit(){
    console.log(this.climateControllerForm.value);
    this.variableManagementService.createGrowRoom(this.climateControllerForm.value).subscribe(() => {
  //    this.mqttInterfaceService.publishMessage()
//      this.dismiss();
    }, error => {
      console.log(error);
    });
  }

  addRecommendedSettings(value: plant){
    console.log(this.variableManagementService.plants);
    var temp = { ...value.settings };
    console.log(temp);
    for(var key of Object.keys(temp)){
      temp[key] = {
        "monitoring_only": false,
        "alarm_min":  temp[key].alarm_min,
        "alarm_max": temp[key].alarm_max,
        "control": {
          "target_value": temp[key].target_value,
          "day_and_night": temp[key].day_and_night,
          "day_target_value": temp[key].day_target_value,
          "night_target_value": temp[key].night_target_value
        }
      }
    }
    console.log(temp);
    this.sensorsForm.patchValue(temp);
  }

  dismiss(){
    this.router.navigate(['/dashboard']);
  }
}
