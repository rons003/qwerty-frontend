import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import { LocalChallengeService } from './shared/local-challenge.service';

import { Challenge } from './shared/challenge.model';


@Injectable()
export class LocalChallengeDetailResolver implements Resolve<Challenge> {
  constructor(private challengeService: LocalChallengeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Challenge> {
    const id = route.params['id'];

    console.log(id);

    return this
            .challengeService
            .getChallenge(id)
            .pipe(
              map(challenge => {
                if (challenge) {
                  challenge.id = id;
                  challenge.nextChallengeId = '' + (parseInt(id, 10) + 1);
                  return challenge;
                }
                this.router.navigate(['/404']);
                return null;
              })
            );
  }
}
