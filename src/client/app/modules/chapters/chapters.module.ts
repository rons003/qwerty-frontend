import { NgModule } from '@angular/core';
import { ChaptersComponent } from './chapters.component';
import { ChapterItemComponent } from './chapter-item.component';
import { ChaptersRoutingModule } from './chapters-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ChapterService } from './chapter.service';



@NgModule({
  imports: [ChaptersRoutingModule, SharedModule],
  declarations: [ChaptersComponent, ChapterItemComponent],
  exports: [ChaptersComponent, ChapterItemComponent],
  providers: [ChapterService],
})
export class ChaptersModule {
}
