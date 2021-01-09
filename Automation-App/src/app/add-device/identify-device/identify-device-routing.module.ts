import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IdentifyDevicePage } from './identify-device.page';

const routes: Routes = [
  {
    path: '',
    component: IdentifyDevicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IdentifyDevicePageRoutingModule {}
