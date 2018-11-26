import { NgModule } from '@angular/core';

import { GroupsRoutingModule } from './groups-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ChaptersModule } from '../chapters/chapters.module';
import { ChallengesModule } from '../challenges/challenges.module';

// import { GroupFormComponent } from './group-form.component';
import { GroupDetailComponent } from './group-detail.component';
// import { StudentListComponent } from './student-list.component';
import { CourseDetailComponent } from './course-detail.component';
// import { AssignmentDetailComponent } from './assignment-detail.component';

import { GroupService } from './group.service';
// import { StudentService } from './student.service';
// import { AssignmentService } from './assignment.service';

@NgModule({
  imports: [
    GroupsRoutingModule,
    SharedModule,
    ChaptersModule,
    ChallengesModule
  ],
  declarations: [
    // GroupFormComponent,
    GroupDetailComponent,
    // StudentListComponent,
    CourseDetailComponent,
    // AssignmentDetailComponent
  ],
  exports: [
    // GroupFormComponent,
    GroupDetailComponent,
    // StudentListComponent,
    CourseDetailComponent,
    // AssignmentDetailComponent
  ],
  // providers: [ GroupService, StudentService, AssignmentService ],
  providers: [ GroupService ],
})
export class GroupsModule { }
