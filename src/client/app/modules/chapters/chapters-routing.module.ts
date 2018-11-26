import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChapterItemComponent } from './chapter-item.component';
import { ChaptersComponent } from './chapters.component';
import { AuthGuard } from '../../shared/authentication/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'chapter',
        component: ChaptersComponent,
        canActivate: [AuthGuard],
        data: { title: 'Chapter Management' }
      },
      {
        path: 'chapteritem',
        component: ChapterItemComponent,
        canActivate: [AuthGuard],
        data: { title: 'Chapter Item' }
      }
    ])
  ],
  exports: [RouterModule]
})
export class ChaptersRoutingModule { }
