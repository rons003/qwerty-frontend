import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GroupDetailResolver } from './group-detail-resolver.service';
import { UserGroupDetailResolver } from './user-group-detail-resolver.service';
import { ChapterDetailResolver } from './chapter-detail-resolver.service';
// import { AssignmentDetailResolver } from './assignment-detail-resolver.service';

// import { GroupFormComponent } from './group-form.component';
import { GroupDetailComponent } from './group-detail.component';
// import { StudentListComponent } from './student-list.component';
import { CourseDetailComponent } from './course-detail.component';
// import { AssignmentDetailComponent } from './assignment-detail.component';

import { AuthGuard } from '../shared/authentication/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      // {
      //   path: 'groups/create',
      //   component: GroupFormComponent,
      //   canActivate: [ AuthGuard ],
      //   data: { title: 'Create Group' }
      // },
      // {
      //   path: 'groups/:id/edit',
      //   component: GroupFormComponent,
      //   canActivate: [ AuthGuard ],
      //   resolve: {
      //     group: GroupDetailResolver
      //   },
      //   data: { title: 'Edit Group' }
      // },
      {
        path: 'dashboard',
        component: GroupDetailComponent,
        canActivate: [ AuthGuard ],
        resolve: {
          group: UserGroupDetailResolver
        },
        data: { title: 'Group' }
      },
      {
        path: 'groups/:id',
        component: GroupDetailComponent,
        canActivate: [ AuthGuard ],
        resolve: {
          group: GroupDetailResolver
        },
        data: { title: 'Group' }
      },
      // {
      //   path: 'groups/:id/students',
      //   component: StudentListComponent,
      //   canActivate: [ AuthGuard ],
      //   resolve: {
      //     group: GroupDetailResolver
      //   },
      //   data: { title: 'Group' }
      // },
      // {
      //   path: 'courses/:id/:chapterId/:chapterItemId',
      //   component: CourseDetailComponent,
      //   canActivate: [ AuthGuard ],
      //   resolve: {
      //     group: GroupDetailResolver
      //   },
      //   data: { title: 'Course' }
      // },
      {
        path: 'courses/:id/:chapterId',
        component: CourseDetailComponent,
        canActivate: [ AuthGuard ],
        resolve: {
          group: GroupDetailResolver,
          chapter: ChapterDetailResolver
        },
        data: { title: 'Course' }
      },
      // {
      //   path: 'courses/:id',
      //   component: CourseDetailComponent,
      //   canActivate: [ AuthGuard ],
      //   resolve: {
      //     group: GroupDetailResolver
      //   },
      //   data: { title: 'Course' }
      // },
      // {
      //   path: 'assignments/:id',
      //   component: AssignmentDetailComponent,
      //   canActivate: [ AuthGuard ],
      //   resolve: {
      //     assignment: AssignmentDetailResolver
      //   },
      //   data: { title: 'Assignment' }
      // },
    ])
  ],
  exports: [ RouterModule ],
  // providers: [ GroupDetailResolver, UserGroupDetailResolver, ChapterDetailResolver, AssignmentDetailResolver ]
  providers: [ GroupDetailResolver, UserGroupDetailResolver, ChapterDetailResolver ]
})
export class GroupsRoutingModule { }
