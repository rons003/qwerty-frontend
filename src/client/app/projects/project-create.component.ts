import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router';

import { ProjectService } from './project.service';

import { ChallengeSandboxComponent } from '../challenges/challenge-sandbox/challenge-sandbox.component';

import { Project } from './project.model';
import { Challenge } from '../challenges/shared/challenge.model';
import { ChallengeSave } from '../challenges/shared/challenge-save.model';
import { Sprite } from '../challenges/shared/sprite.model';

@Component({
  moduleId: module.id,
  selector: 'cg-project-create',
  templateUrl: 'project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
})
export class ProjectCreateComponent {
  @ViewChild('sandbox') sandbox: ChallengeSandboxComponent;

  private project: Project;

  /**
   * Creates an instance of the ProjectCreateComponent.
   */
  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router) { }

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
    const name = prompt('Please enter a name for this project.', 'My New Project');

    if (name && name !== '') {
      this.saveProjectWithService(name);
    } else {
      alert('Name is not valid, please try again.');
    }
  }

  saveProjectWithService(name: string) {
    const project = new Project();
    project.name = name;
    project.phaserState = this.sandbox.getPhaserState();
    project.blocklyState = this.sandbox.getBlocklyState();
    project.dateCreated = new Date();
    this.projectService.saveProject(project).subscribe(project => {
      this.router.navigate(['/projects/' + project.id]);
    });


  }
}
