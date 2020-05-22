import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children:[

  {
    path: 'mointer',
    loadChildren: () => import('./mointer/mointer.module').then( m => m.MointerPageModule)
  },
  {
    path: 'control',
    loadChildren: () => import('./control/control.module').then( m => m.ControlPageModule)
  },
  
   {
      path: '',
      redirectTo: '/dashboard/mointer',
      pathMatch: 'full'
   }
 ]
},
{
  path: '',
  redirectTo: '/dashboard/mointer',
  pathMatch: 'full'
}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
