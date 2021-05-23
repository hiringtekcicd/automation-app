import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddCameraPage } from './add-camera.page';

const routes: Routes = [
  {
    path: '',
    component: AddCameraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddCameraPageRoutingModule {}
