import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateClusterPage } from './create-cluster.page';

const routes: Routes = [
  {
    path: '',
    component: CreateClusterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateClusterPageRoutingModule {}
