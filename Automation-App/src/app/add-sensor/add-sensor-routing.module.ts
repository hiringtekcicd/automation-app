import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSensorPage } from './add-sensor.page';

const routes: Routes = [
  {
    path: '',
    component: AddSensorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddSensorPageRoutingModule {}
