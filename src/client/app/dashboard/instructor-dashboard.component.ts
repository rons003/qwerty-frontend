import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../shared/authentication/auth.service';
import { GroupService } from '../groups/group.service';

import { Group } from '../groups/group.model';

/**
 * This class represents the lazy loaded DashboardComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'cg-instructor-dashboard',
  templateUrl: 'instructor-dashboard.component.html',
  styleUrls: ['instructor-dashboard.component.css'],
})
export class InstructorDashboardComponent implements OnInit {
  private groupIds: string[] = [];
  private groups: Group[] = [];
  private hasGroups = true;

  /**
   * Creates an instance of the DashboardComponent.
   */
  constructor(
    private authService: AuthService,
    private groupService: GroupService,
    private router: Router
  ) {}

  /**
   * OnInit
   */
  ngOnInit() {
    const activeUser = this.authService.getActiveUser();

    this
      .groupService
      .getGroupsForUserId(activeUser.id)
      .subscribe(
        (groupIds: string[]) => {
          if (groupIds.length === 0) {
            this.hasGroups = false;
          }
          // Retrieve each group object
          for (const id of groupIds) {
            this
              .groupService
              .getGroup(id)
              .subscribe(
                (group: Group) => this.groups.push(group),
                err => console.error(err)
              );
          }
        },
        err => console.error(err)
      );
  }

  // onCreateGroupClicked() {
  //   this.router.navigate(['/groups/create']);
  // }

}
