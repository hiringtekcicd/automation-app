import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSystemPage } from './add-system.page';

const routes: Routes = [
  {
    path: '',
    component: AddSystemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddSystemPageRoutingModule {}
