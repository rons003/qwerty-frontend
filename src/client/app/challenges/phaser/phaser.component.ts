import { Component, OnDestroy, Inject } from '@angular/core';

import { PhaserService } from './phaser.service';

import { Challenge } from '../shared/challenge.model';
import { ChallengeSave } from '../shared/challenge-save.model';
import { Sprite } from '../shared/sprite.model';

import { Config } from '../../shared/config/env.config';

declare var $: any; // jQuery

/**
 * This class represents the lazy loaded PhaserComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'cg-phaser',
  templateUrl: 'phaser.component.html',
  styleUrls: ['phaser.component.css']
})
export class PhaserComponent implements OnDestroy {
  public isInPlayMode: boolean;
  private errorMessage = 'Error message test';

  constructor(private phaserService: PhaserService) {
    this.phaserService.playModeEvent.subscribe((value: boolean) => this.isInPlayMode = value);
  }

  ngOnDestroy() {
    this.phaserService.destroyGame();
  }

  getSpriteStates(): Sprite[] {
    return this.phaserService.getSpriteStates();
  }

  initialiseWorkspace(challenge: Challenge,
                      isSandbox: boolean,
                      getBlocks: Function,
                      spriteStates?: Sprite[],
                      challengeClearCallback?: Function,
                      challengeFailCallback?: Function) {

    const phaserContainer: Element = document.getElementById('phaser-div');
    this.phaserService.setupGame(phaserContainer,
                                 challenge,
                                 isSandbox,
                                 getBlocks,
                                 spriteStates,
                                 challengeClearCallback,
                                 challengeFailCallback);

    this.phaserService.alertErrorEvent.subscribe((message: string) => this.showErrorAlertModal(message));
  }

  updateSpriteStates(spriteStates: Sprite[]) {
    this.phaserService.loadSpriteStates(spriteStates);
  }

  togglePlayMode() {
    if (this.isInPlayMode) {
      this.phaserService.pressExit();
    } else {
      this.phaserService.pressPlay();
    }
  }

  getPhaserWidth(): string {
    return Config.PHASER_DISPLAY_SIZE.width + 'px';
  }

  getPhaserHeight(): string {
    return Config.PHASER_DISPLAY_SIZE.height + 'px';
  }

  getActiveSprites(): string[] {
    return this.phaserService.getActiveSprites();
  }

  showErrorAlertModal(message: string) {
    console.log('Error message sent from PhaserService');
    this.errorMessage = message;
    $('#errorAlertModal').modal('show');
  }
}
