import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AddPowerOutletPage } from 'src/app/add-power-outlet/add-power-outlet.page';
import { PowerOutlet } from 'src/app/models/power-outlet.model';

@Component({
  selector: 'grow-lights',
  templateUrl: './grow-lights.component.html',
  styleUrls: ['./grow-lights.component.scss'],
})
export class GrowLightsComponent implements OnInit {
  isOpen: boolean = false;

  @Input() parentForm: FormGroup;
  @Input() powerOutlets: PowerOutlet[];
  @Output() newPowerOutletEvent = new EventEmitter<PowerOutlet>();
  growLightsForm: FormGroup;

  get powerOutletsArray() : FormArray {
    return this.growLightsForm.get("power_outlets") as FormArray
  }
  
  constructor(private fb: FormBuilder, private modalController: ModalController) { }

  ngOnInit() {
    this.growLightsForm = this.fb.group({
      'lights_on': this.fb.control(null),
      'lights_off': this.fb.control(null),
      'power_outlets': this.fb.array([])
    });

    this.parentForm.addControl('grow_lights', this.growLightsForm);
  }

  toggleAccordion() {
    this.isOpen = !this.isOpen;
  }

  ngOnDestroy(){
    this.parentForm.removeControl('grow_lights');
  }

  isPowerOutletSetup(name: string): boolean {
    for(var i = 0; i < this.powerOutlets.length; i++) {
      if(this.powerOutlets[i].name == name) {
        return true;
      }
    }
    return false;
  }

  newPowerOutlet() {
    let currentLength = this.powerOutletsArray.length;
    let fbGroup = this.fb.group({
      ["grow_light_" + (currentLength + 1)]: this.fb.control(false)
    });

    this.powerOutletsArray.push(fbGroup);
  }

  onOutletToggleChange(name: string, formKey: string) {
    console.log("here");
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

  async presentAddPowerOutletModal(powerOutletName: string, formKey: string) {
    const modal = await this.modalController.create({
      component: AddPowerOutletPage,
      componentProps: {
        'powerOutletName': powerOutletName
      }
    });

    modal.onWillDismiss().then((returnValue) => {
      if(returnValue.data) {
        this.newPowerOutletEvent.emit(returnValue.data);
      } else {
        this.growLightsForm.patchValue( { [formKey]: false } );
      }
    });
    return await modal.present();
  }
}
