import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddFertigationSystemPage } from './add-fertigation-system.page';

const routes: Routes = [
  {
    path: '',
    component: AddFertigationSystemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddFertigationSystemPageRoutingModule {}
