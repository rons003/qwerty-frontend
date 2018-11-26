import { NgModule } from '@angular/core';
import { SchoolAdminComponent } from './school-admin.component';
import { SchoolAdminRoutingModule } from './school-admin-routing.module';
import { SharedModule } from '../../shared/shared.module';
// import { ProjectsModule } from '../projects/projects.module';


@NgModule({
  // imports: [ DashboardRoutingModule, SharedModule, ProjectsModule ],
  imports: [ SchoolAdminRoutingModule, SharedModule ],
  declarations: [ SchoolAdminComponent ],
  exports: [ SchoolAdminComponent ],
  providers: [],
})
export class SchoolAdminModule { }
