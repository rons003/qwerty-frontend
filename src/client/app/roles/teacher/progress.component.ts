import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router';
import { Location } from '@angular/common';

import { AuthService } from '../../shared/authentication/auth.service';
import { UserService } from '../../shared/user.service';
import { GroupService } from '../../groups/group.service';
import { ChallengeService } from '../../challenges/shared/challenge.service';
import { ChallengeSaveService } from '../../challenges/shared/challenge-save.service';

import { User } from '../../shared/user.model';
import { Group } from '../../groups/group.model';
import { Chapter } from '../../chapters/chapter.model';
import { ChapterItem } from '../../chapters/chapter-item.model';
import { Sprite } from '../../challenges/shared/sprite.model';
import { Challenge } from '../../challenges/shared/challenge.model';
import { ChallengeSave } from '../../challenges/shared/challenge-save.model';

import 'rxjs/add/operator/switchMap';

declare var $: any; //jquery

@Component({
    moduleId: module.id,
    selector: 'cg-progress',
    templateUrl: 'progress.Component.html',
    styleUrls: ['progress.component.css']

})

export class ProgressComponent implements OnInit {
    show = true;
    @Input() group: Group;
    @Input() chapter: Chapter;

    private user: User;

    private displayShown: string;

    private goToNextBtnName: string;

    private selectedChapter: Chapter;
    private selectedChapterItem: ChapterItem;
    private selectedChallenge: Challenge;

    private challengeSave: ChallengeSave;

    /**
     * Creates an instance of the CourseDetailComponent.
     */
    constructor(
      private authService: AuthService,
      private userService: UserService,
      private groupService: GroupService,
      private challengeService: ChallengeService,
      private challengeSaveService: ChallengeSaveService,
      private router: Router,
      private route: ActivatedRoute,
      private location: Location
    ) { }
    showModal() {
        if (this.show === true) {
                $('#centralModalInfo').modal('show');
        }
        return this.show = false;
    }
    /**
     * Retrieves Group by id given in the URL. Retrieves all chapters and challenges for group's curriculum.
     */
    ngOnInit() {
      this.user = this.authService.getActiveUser();

      this.route.data.subscribe((data: { group: Group, chapter: Chapter }) => {
        this.group = data.group;
        this.selectedChapter = data.chapter;
        this.showChapterItem(this.selectedChapter.chapterItems[0]);
      });
    }

    getChallengeSave(): ChallengeSave {
      return this.challengeSave;
    }

    getTitle(): string {
      if (!this.selectedChapter) {
        return 'Loading...';
      }

      let visibleString = '';
      if (this.authService.isActiveUserAdmin() && !this.selectedChapter.visible) {
        visibleString = ' (invisible)';
      }
      return this.selectedChapter.name + visibleString;
    }

    isChapterVisible(chapter: Chapter): boolean {
      return this.groupService.isChapterVisible(this.group, chapter);
    }

    getItemTitle(chapterItem: ChapterItem): string {
      if (chapterItem.type === 'challenge') {
        return 'Challenge: ' + chapterItem.name;
      } else if (chapterItem.type === 'video') {
        return 'Video: ' + chapterItem.name;
      } else if (chapterItem.type === 'slides') {
        return 'Lesson: ' + chapterItem.name;
      } else {
        return chapterItem.name;
      }
    }

    completeSelectedChapterItem() {
      this
        .userService
        .completeChapterItemForUser(this.user, this.selectedChapterItem.id)
        .subscribe(
          (success: boolean) => {
            if (success) {
              this.authService.updateActiveUser(this.user);
            }
          }
        );
    }

    onSaveBtnClicked(blocklyState: string, phaserState: Sprite[]) {
      const save = new ChallengeSave();
      save.blocklyState = blocklyState;
      save.phaserState = phaserState;
      this.challengeSaveService.setChallengeSaveForUserAndChallenge(this.user.id, this.selectedChallenge.id, save)
          .subscribe();
    }

    /**
     * Called when user wants to move to next challenge or next chapter.
     * Assume that a challenge is currently selected.
     */
    goToNextChapterItem() {
      // Get index of current chapter item within selected chapter's challenges
      const index = this.selectedChapter.chapterItems.indexOf(this.selectedChapterItem);

      // Check if there is another chapter item in this chapter
      if (index < this.selectedChapter.chapterItems.length - 1) {
        // Show the next chapter item in this chapter
        this.showChapterItem(this.selectedChapter.chapterItems[index + 1]);
      } else {
        // Do Nothing
      }
    }

    isChallengeShown(): boolean {
      return this.displayShown && this.displayShown === 'challenge';
    }

    showChapterItem(chapterItem: ChapterItem): void {
      this.displayShown = chapterItem.type;
      this.selectedChapterItem = chapterItem;

      if (this.selectedChapterItem.type === 'challenge') {
        this
          .challengeService
          .getChallenge(this.selectedChapterItem.challengeId)
          .subscribe(
            (challenge: Challenge) => {
              this.selectedChallenge = challenge;

              this
                .challengeSaveService
                .getChallengeSaveForUserAndChallenge(this.user.id, challenge.id)
                .subscribe(
                  (save: ChallengeSave) => {
                    if (save) {
                     this.challengeSave = save;
                    }
                  },
                  err => console.error(err)
                );
            },
            err => console.error(err)
          );

        // Check if challenge is the last and set next btn name
        const index = this.selectedChapter.chapterItems.indexOf(this.selectedChapterItem);
        if (index === this.selectedChapter.chapterItems.length - 1) {
          this.goToNextBtnName = '';
        } else {
          this.goToNextBtnName = 'Next Challenge';
        }
      } else {
        this
          .userService
          .completeChapterItemForUser(this.user, chapterItem.id)
          .subscribe(
            (success: boolean) => {
              if (success) {
                this.authService.updateActiveUser(this.user);
              }
            },
            err => console.error(err)
          );
      }
    }

    showProgress() {
      this.displayShown = 'progress';
    }

    isChapterActive(chapter: Chapter): boolean {
      return this.selectedChapter.id === chapter.id;
    }

    isChapterItemActive(chapter: Chapter, chapterItem: ChapterItem): boolean {
      return this.displayShown !== 'progress' &&
             this.selectedChapter.id === chapter.id &&
             this.selectedChapterItem &&
             this.selectedChapterItem.id === chapterItem.id;
    }

    isChapterCompleted(chapter: Chapter): boolean {
      if (!this.group) {
        return false;
      }
      return this.user.chapterProgress.get(chapter.id) !== null;
    }

    isChapterItemCompleted(chapterItem: ChapterItem): boolean {
      if (!this.group) {
        return false;
      }
      return this.userService.hasUserCompletedChapterItem(this.user, chapterItem.id);
    }

    isChapterItemCompletedForStudent(student: User, chapterItem: ChapterItem): boolean {
      if (!this.group) {
        return false;
      }
      return this.userService.hasUserCompletedChapterItem(student, chapterItem.id);
    }

  }
