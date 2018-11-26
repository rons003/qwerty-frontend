import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GroupService } from '../groups/group.service';
// import { ProjectService } from '../projects/project.service';
import { AuthService } from '../shared/authentication/auth.service';

import { User } from '../shared/user.model';
import { Group } from '../groups/group.model';
// import { Project } from '../projects/project.model';
// import { ChapterItem } from '../chapters/chapter-item.model';
// import { Challenge } from '../challenges/shared/challenge.model';

/**
 * This class represents the lazy loaded DashboardComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'cg-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private user: User;
  private group: Group;
  // private projects: Project[] = [];

  /**
   * Creates an instance of the DashboardComponent.
   */
  constructor(
    private groupService: GroupService,
    // private projectService: ProjectService,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * OnInit
   */
  ngOnInit() {
    const user = this.authService.getActiveUser();

    this
      .groupService
      .getGroupsForUserId(user.id)
      .subscribe(
        (groupIds: string[]) => {
          // Retrieve first group object
          this
            .groupService
            .getGroup(groupIds[0])
            .subscribe(
              (group: Group) => this.group = group,
              err => console.error(err)
            );
        },
        err => console.error(err)
      );
  }

  // getItemTitle(chapterItem: ChapterItem): string {
  //   if (chapterItem.type === 'challenge') {
  //     return 'Challenge: ' + chapterItem.name;
  //   } else if (chapterItem.type === 'video') {
  //     return 'Video: ' + chapterItem.name;
  //   } else if (chapterItem.type === 'slides') {
  //     return 'Lesson: ' + chapterItem.name;
  //   } else {
  //     return chapterItem.name;
  //   }
  // }

  onCreateGroupClicked() {
    this.router.navigate(['/groups/create']);
  }

  goToProjects() {
    this.router.navigate(['/projects']);
  }

}
