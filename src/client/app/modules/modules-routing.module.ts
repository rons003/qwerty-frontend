import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModulesComponent } from './modules.component';
import { AuthGuard } from '../shared/authentication/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'mymodules',
        component: ModulesComponent,
        canActivate: [AuthGuard],
        data: { title: 'My Modules', breadcrumb: 'mymodules' }
      },
    ])
  ],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
