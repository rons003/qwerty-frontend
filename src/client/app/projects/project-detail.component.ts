import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router';
import { HttpClient  } from '@angular/common/http';

import { ProjectService } from './project.service';

import { ChallengeSandboxComponent } from '../challenges/challenge-sandbox/challenge-sandbox.component';

import { Project } from './project.model';
import { Challenge } from '../challenges/shared/challenge.model';
import { ChallengeSave } from '../challenges/shared/challenge-save.model';
import { Sprite } from '../challenges/shared/sprite.model';

@Component({
  moduleId: module.id,
  selector: 'cg-project-detail',
  templateUrl: 'project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
})
export class ProjectDetailComponent implements OnInit {
  @ViewChild('sandbox') sandbox: ChallengeSandboxComponent;

  private project: Project;
  private challenge: Challenge = new Challenge();

  /**
   * Creates an instance of the ProjectDetailComponent.
   */
  constructor(
    private http: HttpClient,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe((data: { project: Project }) => {
      this.project = data.project;
    });
  }

  getPhaserState(): Sprite[] {
    if (this.project) {
      return this.project.phaserState;
    }
    return null;
  }

  getBlocklyState(): string {
    if (this.project) {
      return this.project.blocklyState;
    }
    return null;
  }

  saveProject() {
    this.project.phaserState = this.sandbox.getPhaserState();
    this.project.blocklyState = this.sandbox.getBlocklyState();
    this.projectService.saveProject(this.project).subscribe(project => {
      if (project) {
       this.project = project;
      }
    });
  }
}
