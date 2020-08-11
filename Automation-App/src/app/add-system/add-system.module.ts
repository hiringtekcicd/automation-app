import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddSystemPageRoutingModule } from './add-system-routing.module';

import { AddSystemPage } from './add-system.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddSystemPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [AddSystemPage]
})
export class AddSystemPageModule {}
