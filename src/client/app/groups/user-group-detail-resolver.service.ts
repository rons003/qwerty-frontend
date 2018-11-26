import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import 'rxjs/add/operator/mergeMap';

import { GroupService } from './group.service';
import { AuthService } from '../shared/authentication/auth.service';

import { Group } from './group.model';
import { Chapter } from '../chapters/chapter.model';


@Injectable()
export class UserGroupDetailResolver implements Resolve<Group> {
  constructor(private groupService: GroupService,
              private authService: AuthService,
              private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Group> {
    const user = this.authService.getActiveUser();

    return this
            .groupService
            .getGroupsForUserId(user.id)
            .flatMap((data: string[]) => {
              const groupId = data[0];

              if (!groupId) {
                this.router.navigate(['/404']);
                return null;
              }

              return this.groupService.getGroupWithObjects(groupId);
            })
            .pipe(
              map((group: Group) => {
                if (group) {
                  console.log(group);
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
