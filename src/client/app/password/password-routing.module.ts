import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PasswordComponent } from './password.component';
import { AdminGuard } from '../shared/authentication/admin.guard';
import { SuperAdminGuard } from '../shared/authentication/superadmin.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'password',
        component: PasswordComponent,
        canActivate: [],
        data: { title: 'Change Password' }
      }
    ])
  ],
  exports: [RouterModule]
})
export class PasswordRoutingModule { }
