import { Component, Inject, Input, OnChanges, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';

import { PhaserComponent } from '../phaser/phaser.component';
import { BlocklyComponent } from '../blockly/blockly.component';

import { Challenge } from '../shared/challenge.model';
import { ChallengeSave } from '../shared/challenge-save.model';
import { Sprite } from '../shared/sprite.model';

import 'rxjs/add/operator/switchMap';
import { Config } from '../../shared/config/env.config';
import { AuthService } from '../../shared/authentication/auth.service';

declare var $: any; // jQuery

@Component({
  moduleId: module.id,
  selector: 'cg-challenge-detail',
  templateUrl: 'challenge-detail.component.html',
  styleUrls: ['../challenge.component.css', './challenge-detail.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChallengeDetailComponent implements OnChanges {
  @ViewChild('phaser') phaser: PhaserComponent;
  @ViewChild('blockly') blockly: BlocklyComponent;

  @Input() challenge: Challenge;
  @Input() challengeSave: ChallengeSave;
  @Input() onChallengeComplete: Function;
  @Input() goToNextBtnName: string;
  @Input() goToNext: Function;
  @Input() onSaveBtnClicked: Function;

  isInstructionsVisible = true;
  isHintVisible = false;
  isSolutionsVisible = false;
  isChallengeClear = false;
  isPassChallengeVisible = false;

  constructor(private authService: AuthService) { }

  /**
   * Checks for changes to Inputs and updates BlocklyComponent when needed.
   */
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const change = changes[propName];
      const curr  = JSON.stringify(change.currentValue);
      const prev = JSON.stringify(change.previousValue);

      // If there's no change
      if (curr === prev) {
        return;
      }

      if (propName === 'challenge' && change.currentValue) {
        this.resetChallenge();

        const challenge: Challenge = change.currentValue;
        let blocklyState: string = null;
        let phaserState: Sprite[] = null;

        // Use the saved ChallengeSave only if its challenge id matches the current challenge
        if (this.challengeSave && this.challengeSave.challengeId === challenge.id) {
          blocklyState = this.challengeSave.blocklyState;
          phaserState = this.challengeSave.phaserState;
        } else {
          this.challengeSave = null;
        }

        this.phaser.initialiseWorkspace(challenge,
                                        false,
                                        this.blockly.getBlocks.bind(this.blockly),
                                        phaserState,
                                        this.onChallengeClear.bind(this),
                                        this.onChallengeFail.bind(this));
        this.blockly.initialiseWorkspace(challenge, false, this.phaser.getActiveSprites.bind(this.phaser), blocklyState);

      } else if (propName === 'challengeSave') {
        const save: ChallengeSave = change.currentValue;
        if (save) {
          this.blockly.updateWorkspaceState(save.blocklyState);
          this.phaser.updateSpriteStates(save.phaserState);
        }
      }
    }
  }

  saveChallenge() {
    const blocklyState: string = this.blockly.getWorkspaceState();
    const phaserState: Sprite[] = this.phaser.getSpriteStates();
    this.onSaveBtnClicked(blocklyState, phaserState);
    this.showAlert();
  }

  /**
   *  Callback function for PhaserComponent to execute when the challenge is cleared.
   */
  onChallengeClear() {
    // TODO call to add points, achievements, etc.
    this.isChallengeClear = true;
    this.onChallengeComplete();

    const context = this;
    setTimeout(function() {
      context.isPassChallengeVisible = true;
    }, 100, context);

    this.saveChallenge();
  }

  onChallengeFail() {
    this.showFailTooltip();
  }

  onNextBtnClicked() {
    this.resetChallenge();
    this.goToNext();
  }

  isInPlayMode() {
    return this.phaser.isInPlayMode;
  }

  /**
   * Handles resetting of any challenge variables.
   */
  resetChallenge() {
    this.isChallengeClear = false;
    this.isInstructionsVisible = true;
    this.isHintVisible = false;
    this.isSolutionsVisible = false;
    this.isPassChallengeVisible = false;
  }

  /**
   * Resets challenge data in Phaser and Blockly components
   */
  resetChallengeData() {
    console.log('resetting challenge...');
    this.resetChallenge();
    this.isInstructionsVisible = false;

    this.phaser.initialiseWorkspace(this.challenge, false, this.blockly.getBlocks.bind(this.blockly),
                                    null, this.onChallengeClear.bind(this));
    this.blockly.initialiseWorkspace(this.challenge, false, this.phaser.getActiveSprites.bind(this.phaser), null);
  }

  togglePlayMode() {
    this.phaser.togglePlayMode();
  }

  toggleSolutions() {
    this.isSolutionsVisible = !this.isSolutionsVisible;

    // Ensures only one Panel is open at any one time
    this.isInstructionsVisible = false;
    this.isHintVisible = false;
  }

  toggleHint() {
    this.isHintVisible = !this.isHintVisible;

    // Ensures only one Panel is open at any one time
    this.isInstructionsVisible = false;
    this.isSolutionsVisible = false;
  }

  toggleInstructions() {
    this.isInstructionsVisible = !this.isInstructionsVisible;

    // Ensures only one Panel is open at any one time
    this.isHintVisible = false;
    this.isSolutionsVisible = false;
  }

  getBlocklyHeight(): string {
    return Config.BLOCKLY_DISPLAY_SIZE.height + 'px';
  }

  hidePassChallengePanel() {
    this.isPassChallengeVisible = false;
  }

  showFailTooltip() {
    $('#btn-hints').tooltip('show');

    setTimeout(function() {
      $('#btn-hints').tooltip('hide');
    }, 3000);
  }

  showAlert() {
    // Get the snackbar DIV
    const x = document.getElementById('snackbar');

    // Add the 'show' class to DIV
    x.className = 'show';

    // After 3 seconds, remove the show class from DIV
    setTimeout(function() {
      x.className = x.className.replace('show', '');
    }, 3000);
  }
}
