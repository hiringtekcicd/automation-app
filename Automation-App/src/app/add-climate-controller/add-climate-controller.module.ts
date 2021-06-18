import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddClimateControllerPageRoutingModule } from './add-climate-controller-routing.module';

import { AddClimateControllerPage } from './add-climate-controller.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddClimateControllerPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [AddClimateControllerPage]
})
export class AddClimateControllerPageModule {}
