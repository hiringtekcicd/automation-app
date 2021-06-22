import { AtLeastOneEnableValidator } from './../../validators/atleastoneenable.validator';
import { DayNightTargetValidator } from 'src/app/validators/daynighttarget.validator';
import { TwoValCompareValidator } from './../../validators/twovalcompare.validator';
import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, OnChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AddPowerOutletPage } from 'src/app/add-power-outlet/add-power-outlet.page';
import { PowerOutlet } from 'src/app/models/power-outlet.model';

@Component({
  selector: 'humidity',
  templateUrl: './humidity.component.html',
  styleUrls: ['./humidity.component.scss'],
})
export class HumidityComponent implements OnInit, OnDestroy {
  isOpen: boolean = false;

  @Input() powerOutlets: PowerOutlet[];
  @Input() parentForm: FormGroup;
  @Input() topicID: string;

  @Output() newPowerOutletEvent = new EventEmitter<PowerOutlet>();
  
  humidityForm: FormGroup;
  controlForm: FormGroup;
  
  constructor(private fb: FormBuilder, private modalController: ModalController, private changeDetectorRef: ChangeDetectorRef,
    private twoValCompareValidator : TwoValCompareValidator,
    private atLeastOneEnableValidator: AtLeastOneEnableValidator) { }

  ngOnInit() {
    this.controlForm = this.fb.group({
      'tgt': this.fb.control(null, [Validators.min(0), Validators.max(100)]),
      'up_ctrl': this.fb.control(false),
      'down_ctrl': this.fb.control(false)
    });

    this.humidityForm = this.fb.group({
      'monit_only': this.fb.control(false),
      'control': this.controlForm,
      'alarm_min': this.fb.control(null, [Validators.required, Validators.min(0), Validators.max(99)]),
      'alarm_max': this.fb.control(null, [Validators.required, Validators.min(1), Validators.max(100)])
    }, {validators: [this.twoValCompareValidator.twoValCompare('alarm_min','alarm_max')]});

    this.parentForm.addControl('humidity', this.humidityForm);
    this.manualCheckValidity();
  }

  toggleAccordion() {
    this.isOpen = !this.isOpen;
    this.manualCheckValidity();
  }

  ngOnDestroy() {
    this.parentForm.removeControl('humidity');
  }

  isPowerOutletSetup(name: string): boolean {
    for(var i = 0; i < this.powerOutlets.length; i++) {
      if(this.powerOutlets[i].name == name) {
        return true;
      }
    }
    return false;
  }

  onOutletToggleChange(name: string, formKey: string) {
      let isPowerOutletConfigured;
      this.powerOutlets.forEach(powerOutlet => {
        if(powerOutlet.name == name) {
          isPowerOutletConfigured = true;
        }
      });
      if(!isPowerOutletConfigured) {
        this.presentAddPowerOutletModal(name, formKey);
      }
  }

  manualCheckValidity(){
    for (let key in this.controlForm.controls) {
      this.controlForm.controls[key].updateValueAndValidity();
    }
    for (let key in this.humidityForm.controls) {
      this.humidityForm.controls[key].updateValueAndValidity();
    }
  }

  async presentAddPowerOutletModal(powerOutletName: string, formKey: string) {
    const modal = await this.modalController.create({
      component: AddPowerOutletPage,
      componentProps: {
        'powerOutletName': powerOutletName,
        'topicID': this.topicID
      }
    });

    modal.onWillDismiss().then((returnValue) => {
      if(returnValue.data) {
        if(!this.isPowerOutletSetup(powerOutletName)) {
          this.controlForm.patchValue( { [formKey]: true } );
          this.newPowerOutletEvent.emit(returnValue.data);
        }
      } else {
        this.controlForm.patchValue( { [formKey]: false } );
      }
    });
    return await modal.present();
  }
}

