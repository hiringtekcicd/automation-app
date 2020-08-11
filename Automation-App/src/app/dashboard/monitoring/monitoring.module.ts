import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MonitoringPageRoutingModule } from './monitoring-routing.module';

import { MonitoringPage } from './monitoring.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { AddGrowroomPageModule } from 'src/app/add-growroom/add-growroom.module';
import { AddSystemPageModule } from 'src/app/add-system/add-system.module';
import { AddSensorPageModule } from 'src/app/add-sensor/add-sensor.module';
import { CreateClusterPageModule } from 'src/app/create-cluster/create-cluster.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MonitoringPageRoutingModule,
    ComponentsModule,
    AddGrowroomPageModule,
    AddSystemPageModule,
    AddSensorPageModule,
    CreateClusterPageModule
  ],
  declarations: [MonitoringPage]
})
export class MonitoringPageModule {}
