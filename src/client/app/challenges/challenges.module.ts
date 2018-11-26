import { NgModule } from '@angular/core';

import { ChallengeDetailPageComponent } from './challenge-detail/challenge-detail-page.component';
import { ChallengeDetailComponent } from './challenge-detail/challenge-detail.component';
import { ChallengeSandboxComponent } from './challenge-sandbox/challenge-sandbox.component';
import { ChallengeListComponent } from './challenge-list/challenge-list.component';

import { ChallengesRoutingModule } from './challenges-routing.module';
import { BlocklyModule } from './blockly/blockly.module';
import { PhaserModule } from './phaser/phaser.module';
import { SharedModule } from '../shared/shared.module';

import { LocalChallengeService } from './shared/local-challenge.service';
import { ChallengeService } from './shared/challenge.service';
import { ChallengeSaveService } from '../challenges/shared/challenge-save.service';

@NgModule({
  imports: [
    ChallengesRoutingModule,
    SharedModule,
    BlocklyModule,
    PhaserModule
  ],
  declarations: [
    ChallengeDetailPageComponent,
    ChallengeDetailComponent,
    ChallengeSandboxComponent,
    ChallengeListComponent
  ],
  exports: [
    ChallengeDetailPageComponent,
    ChallengeDetailComponent,
    ChallengeSandboxComponent,
    ChallengeListComponent
  ],
  providers: [
    LocalChallengeService,
    ChallengeService,
    ChallengeSaveService
  ]
})
export class ChallengesModule { }
