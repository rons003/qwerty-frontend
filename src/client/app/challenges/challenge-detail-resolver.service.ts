import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import { ChallengeService } from './shared/challenge.service';

import { Challenge } from './shared/challenge.model';


@Injectable()
export class ChallengeDetailResolver implements Resolve<Challenge> {
  constructor(private challengeService: ChallengeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Challenge> {
    const id = route.params['id'];

    return this
            .challengeService
            .getChallenge(id)
            .pipe(
              map(challenge => {
                if (challenge) return challenge;

                // Id not found
                this.router.navigate(['/404']);
                return null;
              }),
              err => { console.error(err); return null; }
            );
  }
}
