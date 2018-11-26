import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { InstructorDashboardComponent } from './instructor-dashboard.component';

import { AuthGuard } from '../shared/authentication/auth.guard';
import { AdminGuard } from '../shared/authentication/admin.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'dashboard/admin',
        component: InstructorDashboardComponent,
        canActivate: [ AuthGuard, AdminGuard ],
        data: { title: 'Instructor Dashboard' }
      },
      // {
      //   path: 'dashboard',
      //   component: DashboardComponent,
      //   canActivate: [ AuthGuard ],
      //   data: { title: 'Dashboard' }
      // }
    ])
  ],
  exports: [ RouterModule ]
})
export class DashboardRoutingModule { }
