import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlPageRoutingModule } from './control-routing.module';

import { ControlPage } from './control.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { AddGrowroomPageModule } from 'src/app/add-growroom/add-growroom.module';
import { AddSystemPageModule } from 'src/app/add-system/add-system.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ControlPageRoutingModule,
    ReactiveFormsModule,
    AddGrowroomPageModule,
    AddSystemPageModule
  ],
  declarations: [ControlPage]
})
export class ControlPageModule {}
