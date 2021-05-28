import { ECPumpValidator } from './../../validators/ecpump.validator';
import { DayNightTargetValidator } from 'src/app/validators/daynighttarget.validator';
import { TwoValCompareValidator } from 'src/app/validators/twovalcompare.validator';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VariableManagementService } from 'src/app/Services/variable-management.service';

@Component({
  selector: 'ec',
  templateUrl: './ec.component.html',
  styleUrls: ['./ec.component.scss'],
})
export class EcComponent implements OnInit, OnDestroy {
  
  isOpen: boolean = false;

  @Input() parentForm: FormGroup;
  ecForm: FormGroup;
  controlForm: FormGroup;
  day_and_night_targetForm: FormGroup;
  
  constructor(private fb: FormBuilder,
    private twoValCompareValidator : TwoValCompareValidator,
    private dayNightTargetValidator: DayNightTargetValidator,
    private ecPumpValidator: ECPumpValidator) { }

  ngOnInit() {
    this.controlForm = this.fb.group({
      'dose_time': this.fb.control(null, [Validators.required, Validators.min(1), Validators.max(7200)]),
      'dose_interv': this.fb.control(null, [Validators.required, Validators.min(1), Validators.max(14400)]),
      'd_n_enabled': this.fb.control(true),
      'day_tgt': this.fb.control(null, [Validators.min(0), Validators.max(10000)]),
      'night_tgt': this.fb.control(null, [Validators.min(0), Validators.max(10000)]), // TODO conditional
      'tgt': this.fb.control(null, [Validators.min(0), Validators.max(10000)]),
      'pumps': this.fb.group({
        'pump_1': this.fb.control(null, [Validators.min(0), Validators.max(1000)]), // TODO at least one of the following
        'pump_2': this.fb.control(null, [Validators.min(0), Validators.max(1000)]),
        'pump_3': this.fb.control(null, [Validators.min(0), Validators.max(1000)]),
        'pump_4': this.fb.control(null, [Validators.min(0), Validators.max(1000)]),
        'pump_5': this.fb.control(null, [Validators.min(0), Validators.max(1000)])
      })
    }, {validators: [this.dayNightTargetValidator.dayNightTarget('tgt', 'day_tgt', 'night_tgt', 'd_n_enabled')]});

    this.ecForm = this.fb.group({
      'monit_only': this.fb.control(false),
      'control': this.controlForm,
      'alarm_min': this.fb.control(null, [Validators.required, Validators.min(0), Validators.max(9999)]), //TODO do compare values
      'alarm_max': this.fb.control(null, [Validators.required, Validators.min(1), Validators.max(10000)])
    }, {validators: [this.twoValCompareValidator.twoValCompare('alarm_min', 'alarm_max'),
                     this.ecPumpValidator.ecPumpValidator('monit_only', 'control', 'pumps')]});

    this.parentForm.addControl('ec', this.ecForm);
  }

  toggleAccordion() {
    this.isOpen = !this.isOpen;
  }

  ngOnDestroy(){
    this.parentForm.removeControl('ec');
  }
}
