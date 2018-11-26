import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import { ChapterService } from '../chapters/chapter.service';

import { Group } from './group.model';
import { Chapter } from '../chapters/chapter.model';


@Injectable()
export class ChapterDetailResolver implements Resolve<Chapter> {
  constructor(private chapterService: ChapterService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Chapter> {
    const id = route.params['chapterId'];

    return this
            .chapterService
            .getChapterWithObjects(id)
            .pipe(
              map(group => {
                if (group) {
                  return group;
                } else {
                  // Id not found
                  this.router.navigate(['/404']);
                  return null;
                }
              }),
            );
  }
}
