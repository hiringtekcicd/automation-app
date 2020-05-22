import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MointerPageRoutingModule } from './mointer-routing.module';

import { MointerPage } from './mointer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MointerPageRoutingModule
  ],
  declarations: [MointerPage]
})
export class MointerPageModule {}
