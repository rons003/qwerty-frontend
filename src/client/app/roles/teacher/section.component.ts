import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../shared/authentication/auth.service';
import { GroupService } from '../../groups/group.service';

import { Group } from '../../groups/group.model';

declare var $: any; //jquery

@Component({
    moduleId: module.id,
    selector: 'cg-section',
    templateUrl: 'section.Component.html',
    styleUrls: ['section.component.css']

})

export class SectionComponent implements OnInit {
    show = true;
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
    showModal() {
        if (this.show === true) {
                $('#centralModalInfo').modal('show');
        }
        return this.show = false;
    }
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
