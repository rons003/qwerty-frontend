import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { ProjectService } from './project.service';

import { Project } from './project.model';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ProjectListUserResolver implements Resolve<Project[]> {
  constructor(private projectService: ProjectService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Project[]> {
    const projects = this.projectService.getAllProjectsForCurrentUser();
    if (projects) {
      return projects;
    } else {
      // Id not found
      this.router.navigate(['/404']);
      return null;
    }
  }
}
