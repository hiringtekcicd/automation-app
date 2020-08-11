import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddGrowroomPage } from './add-growroom.page';

const routes: Routes = [
  {
    path: '',
    component: AddGrowroomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddGrowroomPageRoutingModule {}
