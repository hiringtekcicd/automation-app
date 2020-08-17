import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisualizationPage } from './visualization.page';

const routes: Routes = [
  {
    path: '',
    component: VisualizationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualizationPageRoutingModule {}
