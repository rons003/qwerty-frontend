import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LocalChallengeService } from '../shared/local-challenge.service';

import { Challenge } from '../shared/challenge.model';

@Component({
  moduleId: module.id,
  selector: 'cg-challenge-list',
  templateUrl: 'challenge-list.component.html',
  styleUrls: ['../challenge.component.css'],
})
export class ChallengeListComponent implements OnInit {
  challenges: Challenge[];

  /**
   * Creates an instance of the ChallengeComponent.
   */
  constructor(
    private router: Router,
    private challengeListService: LocalChallengeService
  ) {}

  /**
   * OnInit
   */
  ngOnInit() {
    this.challengeListService.getChallenges()
      .subscribe((challenges: any) => this.challenges = challenges);
  }

  goToChallenge(selectedChallengeId: string) {
    console.log(selectedChallengeId);
    this.router.navigate(['/challenges/local', selectedChallengeId]);
  }

}
