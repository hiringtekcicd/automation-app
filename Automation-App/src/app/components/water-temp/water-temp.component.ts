import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'water-temp',
  templateUrl: './water-temp.component.html',
  styleUrls: ['./water-temp.component.scss'],
})
export class WaterTempComponent implements OnInit, OnDestroy {
  isOpen: boolean = false;

  @Input() parentForm: FormGroup;
  waterTemperatureForm: FormGroup;
  controlForm: FormGroup;
  day_and_night_targetForm: FormGroup;
  
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    console.log("water temp intialized");
    this.controlForm = this.fb.group({
      'day_and_night': this.fb.control(true),
      'day_target_value': this.fb.control(null),
      'night_target_value': this.fb.control(null),
      'target_value': this.fb.control(null),
      'heater_enabled': this.fb.control(null),
      'cooler_enabled': this.fb.control(null)
    });

    this.waterTemperatureForm = this.fb.group({
      'monitoring_only': this.fb.control(false),
      'control': this.controlForm,
      'alarm_min': this.fb.control(null),
      'alarm_max': this.fb.control(null)
    });

    this.parentForm.addControl('water_temperature', this.waterTemperatureForm);
  }

  toggleAccordion() {
    this.isOpen = !this.isOpen;
  }

  onMonitoringOnly() {
    if(this.waterTemperatureForm.get("monitoring_only").value == true){
      this.waterTemperatureForm.removeControl('control');
    } else {
      this.waterTemperatureForm.addControl('control', this.controlForm);
    }
  }

  ngOnDestroy(){
    this.parentForm.removeControl('water_temperature');
  }
}
