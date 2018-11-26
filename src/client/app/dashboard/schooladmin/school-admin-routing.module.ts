import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SchoolAdminComponent } from '../schooladmin/school-admin.component';

import { AdminGuard } from '../../shared/authentication/admin.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'schooladmin/dashboard',
        component: SchoolAdminComponent,
        canActivate: [AdminGuard],
        data: { title: 'Instructor Dashboard' }
      },
    ])
  ],
  exports: [RouterModule]
})
export class SchoolAdminRoutingModule { }
