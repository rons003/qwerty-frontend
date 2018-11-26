import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { InstructorDashboardComponent } from './instructor-dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
// import { ProjectsModule } from '../projects/projects.module';


@NgModule({
  // imports: [ DashboardRoutingModule, SharedModule, ProjectsModule ],
  imports: [ DashboardRoutingModule, SharedModule ],
  declarations: [ DashboardComponent, InstructorDashboardComponent ],
  exports: [ DashboardComponent, InstructorDashboardComponent ],
  providers: [],
})
export class DashboardModule { }
