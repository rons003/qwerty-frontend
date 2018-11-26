import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../shared/authentication/auth.service';

/**
 * This class represents the lazy loaded DashboardComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'cg-school-admin',
    templateUrl: 'school-admin.component.html',
    styleUrls: ['school-admin.component.css'],
})
export class SchoolAdminComponent implements OnInit {

    /**
     * Creates an instance of the SchoolAdminComponent.
     */
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    /**
     * OnInit
     */
    ngOnInit() {
        const user = this.authService.getActiveUser();

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
