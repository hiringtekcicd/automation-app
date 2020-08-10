import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisualizationPageRoutingModule } from './visualization-routing.module';

import { VisualizationPage } from './visualization.page';
import {ChartsModule} from 'ng2-charts'
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisualizationPageRoutingModule,
    ChartsModule
  ],
  declarations: [VisualizationPage]
})
export class VisualizationPageModule {}
