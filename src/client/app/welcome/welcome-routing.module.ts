import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: WelcomeComponent, data: { breadcrumb: '' } }
    ])
  ],
  exports: [RouterModule]
})
export class WelcomeRoutingModule { }
