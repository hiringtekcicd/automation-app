import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './Services/auth-guard.service';
// import { HomePage } from './home/home.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  //Lazyloading is used to load pages.
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthPageModule)
  },
  {
    path: 'analytics',
    loadChildren: () => import('./graphs/visualization/visualization.module').then(m => m.VisualizationPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'add-growroom',
    loadChildren: () => import('./add-growroom/add-growroom.module').then(m => m.AddGrowroomPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'new-fertigation-system',
    loadChildren: () => import('./add-system/add-system.module').then(m => m.AddSystemPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'add-sensor',
    loadChildren: () => import('./add-sensor/add-sensor.module').then(m => m.AddSensorPageModule),
    canActivate: [AuthGuardService]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
