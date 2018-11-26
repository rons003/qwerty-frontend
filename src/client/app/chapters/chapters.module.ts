import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { ChapterDetailComponent } from './chapter-detail.component';

import { ChapterService } from './chapter.service';

@NgModule({
  imports: [ SharedModule ],
  declarations: [ ChapterDetailComponent ],
  exports: [ ChapterDetailComponent ],
  providers: [ ChapterService ]
})
export class ChaptersModule { }
