import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SuperDashboardComponent } from './super-dashboard.component';

import { AuthGuard } from '../../shared/authentication/auth.guard';
import { SuperAdminGuard } from '../../shared/authentication/superadmin.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'superadmin/dashboard',
        component: SuperDashboardComponent,
        canActivate: [ AuthGuard, SuperAdminGuard ],
        data: { title: 'Super Dashboard' }
      },
    ])
  ],
  exports: [ RouterModule ]
})
export class SuperDashboardRoutingModule { }
