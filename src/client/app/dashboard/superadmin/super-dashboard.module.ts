import { NgModule } from '@angular/core';
import { SuperDashboardComponent } from './super-dashboard.component';
import { SuperDashboardRoutingModule } from './super-dashboard-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ChartsModule } from 'ng2-charts/ng2-charts';

@NgModule({
  // imports: [ DashboardRoutingModule, SharedModule, ProjectsModule ],
  imports: [SuperDashboardRoutingModule, SharedModule, ChartsModule ],
  declarations: [ SuperDashboardComponent ],
  exports: [ SuperDashboardComponent ],
  providers: [],
})
export class SuperDashboardModule { }
