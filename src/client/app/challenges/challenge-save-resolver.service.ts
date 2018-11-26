import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import { AuthService } from '../shared/authentication/auth.service';
import { ChallengeSaveService } from './shared/challenge-save.service';

import { ChallengeSave } from './shared/challenge-save.model';


@Injectable()
export class ChallengeSaveResolver implements Resolve<ChallengeSave> {
  constructor(private authService: AuthService,
              private challengeSaveService: ChallengeSaveService,
              private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ChallengeSave> {
    const id = route.params['id'];

    return this
            .challengeSaveService
            .getChallengeSaveForUserAndChallenge(this.authService.getActiveUser().id, id)
            .pipe(
              map(save => save || null),
              err => { console.error(err); return null; }
            );
  }
}
