import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router';
import { Location } from '@angular/common';

import { ChallengeService } from '../challenges/shared/challenge.service';
import { ChallengeSaveService } from '../challenges/shared/challenge-save.service';

import { Assignment } from './assignment.model';
import { Challenge } from '../challenges/shared/challenge.model';
import { ChallengeSave } from '../challenges/shared/challenge-save.model';
import { Sprite } from '../challenges/shared/sprite.model';

import 'rxjs/add/operator/switchMap';

@Component({
  moduleId: module.id,
  selector: 'cg-assignment-detail',
  templateUrl: 'assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css'],
})
export class AssignmentDetailComponent implements OnInit {
  private nextBtnName = 'Complete';
  private assignment: Assignment;
  private challenge: Challenge;
  private challengeSave: ChallengeSave;

  /**
   * Creates an instance of the ChallengeDetailComponent.
   */
  constructor(
    private challengeService: ChallengeService,
    private challengeSaveService: ChallengeSaveService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  /**
   *
   */
  ngOnInit() {
    this.route.data.subscribe((data: { assignment: Assignment }) => {
      this.assignment = data.assignment;
      this.challenge = this.assignment.challenge;
      this
        .challengeSaveService
        .getChallengeSaveForCurrentUser(this.challenge.id)
        .subscribe(
          (save: ChallengeSave) => {
            this.challengeSave = save;
          },
          err => console.log(err)
        );
    });
  }

  onChallengeComplete() {
    // TODO Update student assignemnt progress
  }

  onSaveBtnClicked(blocklyState: string, phaserState: Sprite[]) {
    const save = new ChallengeSave();
    save.blocklyState = blocklyState;
    save.phaserState = phaserState;
    this.challengeSaveService.setChallengeSaveForCurrentUser(this.challenge.id, save);
  }

  /**
   * Action to move to next challenge.
   */
  goToNext() {
    this.router.navigate(['/dashboard']);
  }

}
