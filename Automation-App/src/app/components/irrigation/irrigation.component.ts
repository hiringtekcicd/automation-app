import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AddPowerOutletPage } from 'src/app/add-power-outlet/add-power-outlet.page';
import { PowerOutlet } from 'src/app/models/power-outlet.model';

@Component({
  selector: 'irrigation',
  templateUrl: './irrigation.component.html',
  styleUrls: ['./irrigation.component.scss'],
})
export class IrrigationComponent implements OnInit {
  isOpen: boolean = false;

  @Input() parentForm: FormGroup;
  @Input() powerOutlets: PowerOutlet[];
  @Output() newPowerOutletEvent = new EventEmitter<PowerOutlet>();
  
  irrigationForm: FormGroup;
  
  constructor(private fb: FormBuilder, private modalController: ModalController) { }

  ngOnInit() {
    this.irrigationForm = this.fb.group({
      'on_interval': this.fb.control(null),
      'off_interval': this.fb.control(null),
      'is_control': this.fb.control(false)
    });

    this.parentForm.addControl('irrigation', this.irrigationForm);
  }

  toggleAccordion() {
    this.isOpen = !this.isOpen;
  }

  ngOnDestroy(){
    this.parentForm.removeControl('irrigation');
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
      this.irrigationForm.patchValue( { [formKey]: false } );
    }
  });
  return await modal.present();
}
}
