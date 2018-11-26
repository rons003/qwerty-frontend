import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AccountComponent } from './account.component';
import { AdminGuard } from '../shared/authentication/admin.guard';
import { SuperAdminGuard } from '../shared/authentication/superadmin.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'account',
        component: AccountComponent,
        canActivate: [],
        data: { title: 'Account Management', breadcrumb: 'Account' }
      }
    ])
  ],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
