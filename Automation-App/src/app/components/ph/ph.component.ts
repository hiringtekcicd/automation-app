import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { TwoValCompareValidator } from 'src/app/validators/twovalcompare.validator';

@Component({
  selector: 'ph',
  templateUrl: './ph.component.html',
  styleUrls: ['./ph.component.scss'],
})
export class PhComponent implements OnInit, OnDestroy {

  isOpen: boolean = false;

  @Input() parentForm: FormGroup;
  phForm: FormGroup;
  controlForm: FormGroup;
  day_and_night_targetForm: FormGroup;
  
  constructor(private fb: FormBuilder,
    private twoValCompareVal : TwoValCompareValidator) { }

  ngOnInit() {
    this.day_and_night_targetForm = this.fb.group({});

    this.controlForm = this.fb.group({
      'dose_time': this.fb.control(null, [Validators.required, Validators.min(1), Validators.max(7200)]),
      'dose_interv': this.fb.control(null, [Validators.required, Validators.min(1), Validators.max(14400)]),
      'd_n_enabled': this.fb.control(true),
      'day_tgt': this.fb.control(null, [Validators.min(0), Validators.max(14)]),
      'night_tgt': this.fb.control(null, [Validators.min(0), Validators.max(14)]), //TODO conditional
      'tgt': this.fb.control(null, [Validators.min(0), Validators.max(14)]),
      'up_ctrl': this.fb.control(false),
      'down_ctrl': this.fb.control(false)
    });

    this.phForm = this.fb.group({
      'monit_only': this.fb.control(false),
      'control': this.controlForm,
      'alarm_min': this.fb.control(null, [Validators.required, Validators.min(0), Validators.max(13.9)]), //TODO compare
      'alarm_max': this.fb.control(null, [Validators.required, Validators.min(0.1), Validators.max(14)])
    }, {validators: [this.twoValCompareVal.twoValCompare('alarm_min', 'alarm_max')]});

    this.parentForm.addControl('ph', this.phForm);
  }

  toggleAccordion() {
    this.isOpen = !this.isOpen;
  }

  ngOnDestroy(){
    this.parentForm.removeControl('ph');
  }

}
