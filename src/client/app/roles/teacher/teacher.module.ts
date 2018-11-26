import { NgModule } from '@angular/core';

import { TeacherComponent } from './teacher.component';
import { SectionComponent } from './section.component';
import { ChapterComponent } from './chapter.component';
import { ProgressComponent } from './progress.component';
import { TeacherRoutingModule } from './teacher-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [ TeacherRoutingModule, SharedModule ],
  declarations: [ TeacherComponent, SectionComponent, ChapterComponent, ProgressComponent],
  exports: [ TeacherComponent, SectionComponent, ChapterComponent, ProgressComponent],
  providers: [],
})
export class TeacherModule {

}
