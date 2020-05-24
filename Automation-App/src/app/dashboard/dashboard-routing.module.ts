import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children:[

  {
    path: 'monitoring',
    loadChildren: () => import('./monitoring/monitoring.module').then( m => m.MonitoringPageModule)
  },
  {
    path: 'control',
    loadChildren: () => import('./control/control.module').then( m => m.ControlPageModule)
  },
  
   {
      path: '',
      redirectTo: '/dashboard/monitoring',
      pathMatch: 'full'
   }
 ]
},
{
  path: '',
  redirectTo: '/dashboard/monitoring',
  pathMatch: 'full'
},

  
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
