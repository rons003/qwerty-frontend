import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GroupDetailResolver } from '../../groups/group-detail-resolver.service';
import { UserGroupDetailResolver } from '../../groups/user-group-detail-resolver.service';
import { ChapterDetailResolver } from '../../groups/chapter-detail-resolver.service';
// import { AssignmentDetailResolver } from './assignment-detail-resolver.service';
import { TeacherComponent } from './teacher.component';
import { ChapterComponent } from './chapter.component';
import { SectionComponent } from './section.component';
import { ProgressComponent } from './progress.component';

import { TeacherGuard } from '../../shared/authentication/teacher.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'teacher',
        component: TeacherComponent,
        canActivate: [TeacherGuard],
        data: { title: 'My Module' }
      },
      {
        path: 'chapter/:id',
        component: ChapterComponent,
        canActivate: [TeacherGuard],
        resolve: {
          group: GroupDetailResolver
        },
        data: { title: 'Chapters', breadcrumb: 'chapter' }
      },
      {
        path: 'section',
        component: SectionComponent,
        canActivate: [TeacherGuard],
        data: { title: 'Sections' }
      },
      {
        path: 'progress/:id/:chapterId',
        component: ProgressComponent,
        canActivate: [TeacherGuard],
        resolve: {
          group: GroupDetailResolver,
          chapter: ChapterDetailResolver
        },
        data: { title: 'Progress' }
      }
    ])
  ],
  exports: [RouterModule]
})
export class TeacherRoutingModule {

}
