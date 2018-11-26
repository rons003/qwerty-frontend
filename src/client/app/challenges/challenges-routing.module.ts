import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LocalChallengeDetailResolver } from './local-challenge-detail-resolver.service';
import { ChallengeDetailResolver } from './challenge-detail-resolver.service';
import { ChallengeSaveResolver } from './challenge-save-resolver.service';

import { ChallengeDetailPageComponent } from './challenge-detail/challenge-detail-page.component';
import { ChallengeListComponent } from './challenge-list/challenge-list.component';

import { AuthGuard } from '../shared/authentication/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'challenges',
        component: ChallengeListComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Challenge List' }
      },
      {
        path: 'challenges/:id',
        component: ChallengeDetailPageComponent,
        canActivate: [ AuthGuard ],
        resolve: {
          challenge: ChallengeDetailResolver,
          challengeSave: ChallengeSaveResolver
        },
        data: { title: 'Challenge' }
      },
      {
        path: 'challenges/local/:id',
        component: ChallengeDetailPageComponent,
        canActivate: [ AuthGuard ],
        resolve: {
          challenge: LocalChallengeDetailResolver,
          challengeSave: ChallengeSaveResolver
        },
        data: { title: 'Challenge' }
      }
    ])
  ],
  exports: [ RouterModule ],
  providers: [ LocalChallengeDetailResolver, ChallengeDetailResolver, ChallengeSaveResolver ]
})
export class ChallengesRoutingModule { }
