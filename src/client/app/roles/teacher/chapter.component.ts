import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';

import { ExcludeElementsPipe } from '../../shared/exclude-elements.pipe';

import { AuthService } from '../../shared/authentication/auth.service';
import { GroupService } from '../../groups/group.service';
import { UserService } from '../../shared/user.service';
// import { ChallengeService } from '../challenges/shared/challenge.service';

import { User } from '../../shared/user.model';
import { Group } from '../../groups/group.model';
// import { Assignment } from './assignment.model';
import { Chapter } from '../../chapters/chapter.model';
import { ChapterItem } from '../../chapters/chapter-item.model';
// import { Challenge } from '../challenges/shared/challenge.model';
declare var $: any; //jquery

@Component({
    moduleId: module.id,
    selector: 'cg-chapter',
    templateUrl: 'chapter.Component.html',
    styleUrls: ['chapter.component.css']

})

export class ChapterComponent {
    show = true;
    private group: Group;
    private user: User;

    /**
     * Creates an instance of the GroupDetailComponent.
     */
    constructor(
      private authService: AuthService,
      private groupService: GroupService,
      private userService: UserService,
      // private challengeService: ChallengeService,
      private excludeElementsPipe: ExcludeElementsPipe,
      private router: Router,
      private route: ActivatedRoute,
      private location: Location,
    ) {
      this.user = authService.getActiveUser();

      this.route.data.subscribe((data: { group: Group }) => {
        this.group = data.group;

        console.log(this.group);
      });
    }
    showModal() {
        if (this.show === true) {
                $('#centralModalInfo').modal('show');
        }
        return this.show = false;
    }
    isChapterItemCompleted(chapterItem: ChapterItem): boolean {
      if (!this.group) {
        return false;
      }
      return this.user.chapterItemProgress.get(chapterItem.id) !== null;
    }

    isChapterVisible(chapter: Chapter): boolean {
      return this.groupService.isChapterVisible(this.group, chapter);
    }

    toggleVisibilityOfChapter(chapter: Chapter) {
      this
        .groupService
        .toggleVisibilityOfChapter(this.group, chapter.id)
        .subscribe(
          (group: Group) => {
            if (group) this.group = group;
          },
          err => console.error(err)
        );
    }

  }
