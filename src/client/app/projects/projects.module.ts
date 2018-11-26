import { NgModule } from '@angular/core';

import { ProjectsRoutingModule } from './projects-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ChallengesModule } from '../challenges/challenges.module';

import { ProjectService } from './project.service';

import { ProjectListComponent } from './project-list.component';
import { ProjectCreateComponent } from './project-create.component';
import { ProjectDetailComponent } from './project-detail.component';

@NgModule({
  imports: [ ProjectsRoutingModule, SharedModule, ChallengesModule ],
  declarations: [ ProjectListComponent, ProjectCreateComponent, ProjectDetailComponent ],
  exports: [ ProjectListComponent, ProjectCreateComponent, ProjectDetailComponent ],
  providers: [ ProjectService ],
})
export class ProjectsModule { }
