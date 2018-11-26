import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ProjectService } from './project.service';
import { AuthService } from '../shared/authentication/auth.service';

import { Project } from './project.model';

/**
 * This class represents the lazy loaded ProjectListComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'cg-project-list',
  templateUrl: 'project-list.component.html',
  styleUrls: ['project-list.component.css'],
})
export class ProjectListComponent implements OnInit {
  private title = 'Projects';
  private projects: Project[] = [];

  /**
   * Creates an instance of the ProjectListComponent.
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.route.data.subscribe((data: { title: string, projects: Project[] }) => {
      this.title = data.title;
      this.projects = data.projects;
    });
  }

}
