import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import { GroupService } from './group.service';

import { Group } from './group.model';
import { Chapter } from '../chapters/chapter.model';


@Injectable()
export class GroupDetailResolver implements Resolve<Group> {
  constructor(private groupService: GroupService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Group> {
    const id = route.params['id'];

    return this
            .groupService
            .getGroupWithObjects(id)
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
