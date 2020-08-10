import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateClusterPageRoutingModule } from './create-cluster-routing.module';

import { CreateClusterPage } from './create-cluster.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateClusterPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CreateClusterPage]
})
export class CreateClusterPageModule {}
