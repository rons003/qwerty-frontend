import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router';
import { Location } from '@angular/common';

import { AuthService } from '../../shared/authentication/auth.service';
import { ChallengeService } from '../shared/challenge.service';
import { ChallengeSaveService } from '../shared/challenge-save.service';

import { Challenge } from '../shared/challenge.model';
import { ChallengeSave } from '../shared/challenge-save.model';
import { Sprite } from '../shared/sprite.model';

import 'rxjs/add/operator/switchMap';

@Component({
  moduleId: module.id,
  selector: 'cg-challenge-detail-page',
  templateUrl: 'challenge-detail-page.component.html',
  styleUrls: ['../challenge.component.css', './challenge-detail.component.css'],
})
export class ChallengeDetailPageComponent implements OnInit {
  @Input() challenge: Challenge;
  @Input() challengeSave: ChallengeSave;

  private goToNextBtnName = 'Next Challenge';

  /**
   * Creates an instance of the ChallengeDetailComponent.
   */
  constructor(
    private authService: AuthService,
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
    this.route.data
      .subscribe((data: { challenge: Challenge, challengeSave: ChallengeSave }) => {
        this.challenge = data.challenge;
        this.challengeSave = data.challengeSave;
      });
  }

  onChallengeComplete() {
    // Do nothing
  }

  onSaveBtnClicked(blocklyState: string, phaserState: Sprite[]) {
    const save = new ChallengeSave();
    save.blocklyState = blocklyState;
    save.phaserState = phaserState;
    this.challengeSaveService.setChallengeSaveForUserAndChallenge(this.authService.getActiveUser().id, this.challenge.id, save);
  }

  /**
   * Action to move to next challenge.
   */
  goToNext() {
    this.router.navigate(['/challenges/local', this.challenge.nextChallengeId]);
  }

}
