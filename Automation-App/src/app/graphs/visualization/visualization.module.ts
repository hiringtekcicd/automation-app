import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisualizationPageRoutingModule } from './visualization-routing.module';

import { VisualizationPage } from './visualization.page';
import {ChartsModule} from 'ng2-charts'
import { AddGrowroomPageModule } from 'src/app/add-growroom/add-growroom.module';
import { AddSystemPageModule } from 'src/app/add-system/add-system.module';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisualizationPageRoutingModule,
    ChartsModule,
    AddGrowroomPageModule,
    AddSystemPageModule
  ],
  declarations: [VisualizationPage]
})
export class VisualizationPageModule {}
