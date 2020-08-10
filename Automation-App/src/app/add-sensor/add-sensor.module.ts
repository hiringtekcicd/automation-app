import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddSensorPageRoutingModule } from './add-sensor-routing.module';

import { AddSensorPage } from './add-sensor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddSensorPageRoutingModule
  ],
  declarations: [AddSensorPage]
})
export class AddSensorPageModule {}
