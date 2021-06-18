import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddClimateControllerPage } from './add-climate-controller.page';

const routes: Routes = [
  {
    path: '',
    component: AddClimateControllerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddClimateControllerPageRoutingModule {}
