import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CamerasPage } from './cameras.page';

const routes: Routes = [
  {
    path: '',
    component: CamerasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CamerasPageRoutingModule {}
