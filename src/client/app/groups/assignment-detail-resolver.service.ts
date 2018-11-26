import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { AssignmentService } from './assignment.service';

import { Assignment } from './assignment.model';

@Injectable()
export class AssignmentDetailResolver implements Resolve<Assignment> {
  constructor(private assignmentService: AssignmentService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Assignment> {
    const id = route.params['id'];

    return this
             .assignmentService
             .getAssignment(id)
             .pipe(
               res => res,
               err => {
                 this.router.navigate(['/404']);
                 return null;
               }
             );
  }
}
