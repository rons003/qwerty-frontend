import { Component, Input } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

import { ChapterItem } from './chapter-item.model';

/**
 * This class represents the lazy loaded ChapterDetailComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'cg-chapter-detail',
  templateUrl: 'chapter-detail.component.html',
  styleUrls: ['chapter-detail.component.css'],
})
export class ChapterDetailComponent {
  @Input() chapterItem: ChapterItem;

  /**
   * Creates an instance of the ChapterDetailComponent.
   */
  constructor(private sanitizer: DomSanitizer) {

  }

  getUrl(): SafeResourceUrl {
    let url = '';
    if (this.chapterItem) {
      url = this.chapterItem.url;

      // Add options to remove related videos
      if (this.chapterItem.type === 'video') {
        url += '?rel=0';
      }
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
