import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { VariableManagementService } from 'src/app/variable-management.service';

@Component({
  selector: 'humidity',
  templateUrl: './humidity.component.html',
  styleUrls: ['./humidity.component.scss'],
})
export class HumidityComponent implements OnInit, OnDestroy {
  isOpen: boolean = false;

  @Input() parentForm: FormGroup;
  humidityForm: FormGroup;
  controlForm: FormGroup;
  day_and_night_targetForm: FormGroup;
  
  constructor(private variableManagementService: VariableManagementService, private fb: FormBuilder) { }

  ngOnInit() {
    this.controlForm = this.fb.group({
      'day_and_night': this.fb.control(true),
      'day_target_value': this.fb.control(null),
      'night_target_value': this.fb.control(null),
      'target_value': this.fb.control(null)
    });

    this.humidityForm = this.fb.group({
      'monitoring_only': this.fb.control(false),
      'control': this.controlForm,
      'alarm_min': this.fb.control(null),
      'alarm_max': this.fb.control(null)
    });

    this.parentForm.addControl('humidity', this.humidityForm);
  }

  toggleAccordion() {
    this.isOpen = !this.isOpen;
  }

  onMonitoringOnly() {
    if(this.humidityForm.get("monitoring_only").value == true){
      this.humidityForm.removeControl('control');
    } else {
      this.humidityForm.addControl('control', this.controlForm);
    }
  }

  ngOnDestroy(){
    this.parentForm.removeControl('humidity');
  }
}
