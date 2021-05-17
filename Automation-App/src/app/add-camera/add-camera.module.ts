import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddCameraPageRoutingModule } from './add-camera-routing.module';

import { AddCameraPage } from './add-camera.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddCameraPageRoutingModule
  ],
  declarations: [AddCameraPage]
})
export class AddCameraPageModule {}
