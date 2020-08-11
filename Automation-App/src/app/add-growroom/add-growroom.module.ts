import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddGrowroomPageRoutingModule } from './add-growroom-routing.module';

import { AddGrowroomPage } from './add-growroom.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddGrowroomPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [AddGrowroomPage]
})
export class AddGrowroomPageModule {}
