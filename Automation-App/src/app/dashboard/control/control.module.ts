import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlPageRoutingModule } from './control-routing.module';

import { ControlPage } from './control.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { AddClimateControllerPageModule } from 'src/app/add-climate-controller/add-climate-controller.module';
import { AddFertigationSystemPageModule } from 'src/app/add-fertigation-system/add-fertigation-system.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ControlPageRoutingModule,
    ReactiveFormsModule,
    AddClimateControllerPageModule,
    AddFertigationSystemPageModule
  ],
  declarations: [ControlPage]
})
export class ControlPageModule {}
