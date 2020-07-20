import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlPageRoutingModule } from './control-routing.module';

import { ControlPage } from './control.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ControlPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ControlPage]
})
export class ControlPageModule {}
