import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IdentifyDevicePageRoutingModule } from './identify-device-routing.module';

import { IdentifyDevicePage } from './identify-device.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    IdentifyDevicePageRoutingModule
  ],
  declarations: [IdentifyDevicePage]
})
export class IdentifyDevicePageModule {}
