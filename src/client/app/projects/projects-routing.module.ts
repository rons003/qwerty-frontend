import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ProjectDetailResolver } from './project-detail-resolver.service';
import { ProjectListUserResolver } from './project-list-user-resolver.service';
import { ProjectListGroupResolver } from './project-list-group-resolver.service';

import { ProjectListComponent } from './project-list.component';
import { ProjectCreateComponent } from './project-create.component';
import { ProjectDetailComponent } from './project-detail.component';

import { AuthGuard } from '../shared/authentication/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'projects/new',
        component: ProjectCreateComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'New Project' }
      },
      {
        path: 'projects/:id',
        component: ProjectDetailComponent,
        canActivate: [ AuthGuard ],
        resolve: { project: ProjectDetailResolver },
        data: { title: 'View Project' }
      },
      {
        path: 'projects',
        component: ProjectListComponent,
        canActivate: [ AuthGuard ],
        resolve: { projects: ProjectListUserResolver },
        data: { title: 'My Projects' }
      },
      {
        path: 'gallery',
        component: ProjectListComponent,
        canActivate: [ AuthGuard ],
        resolve: { projects: ProjectListGroupResolver },
        data: { title: 'Gallery' }
      }
    ])
  ],
  exports: [ RouterModule ],
  providers: [
    ProjectDetailResolver,
    ProjectListUserResolver,
    ProjectListGroupResolver
  ]
})
export class ProjectsRoutingModule { }
