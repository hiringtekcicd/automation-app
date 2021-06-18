import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddFertigationSystemPageRoutingModule } from './add-fertigation-system-routing.module';
import { AddFertigationSystemPage } from './add-fertigation-system.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddFertigationSystemPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [AddFertigationSystemPage]
})
export class AddFertigationSystemPageModule {}
