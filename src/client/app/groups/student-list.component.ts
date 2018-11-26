import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';

import { ExcludeElementsPipe } from '../shared/exclude-elements.pipe';

import { AuthService } from '../shared/authentication/auth.service';
import { GroupService } from './group.service';
import { UserService } from '../shared/user.service';
import { ChallengeService } from '../challenges/shared/challenge.service';

import { User } from '../shared/user.model';
import { Group } from './group.model';
import { Assignment } from './assignment.model';
import { Chapter } from '../chapters/chapter.model';
import { ChapterItem } from '../chapters/chapter-item.model';
import { Challenge } from '../challenges/shared/challenge.model';

@Component({
  moduleId: module.id,
  selector: 'cg-student-list',
  templateUrl: 'student-list.component.html',
  styleUrls: ['./student-list.component.css'],
})
export class StudentListComponent {
  private group: Group;

  private user: User;

  private selectedChapter: Chapter;

  private challenges: Challenge[] = [];
  private selectedChallenges: Challenge[] = [];

  private selectedChallenge: Challenge;
  private selectedDate: Date;

  private resetPasswords: Map<string, string> = new Map<string, string>();

  /**
   * Creates an instance of the GroupDetailComponent.
   */
  constructor(
    private authService: AuthService,
    private groupService: GroupService,
    private userService: UserService,
    private challengeService: ChallengeService,
    private excludeElementsPipe: ExcludeElementsPipe,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.user = authService.getActiveUser();

    this.route.data.subscribe((data: { group: Group }) => {
      this.group = data.group;
    });
  }

  getResetPassword(student: User): string {
    return this.resetPasswords.get(student.id);
  }

  isPasswordShown(student: User) {
    return this.resetPasswords.get(student.id) !== null;
  }

  resetPassword(student: User) {
    this.userService.resetPasswordForStudent(student).subscribe((newPassword: string) => {
      this.resetPasswords.set(student.id, newPassword);
    });
  }

}
