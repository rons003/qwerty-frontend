import { Component, OnDestroy, Inject } from '@angular/core';

import { BlocklyService } from './blockly.service';

import { Challenge } from '../shared/challenge.model';
import { ChallengeSave } from '../shared/challenge-save.model';
import { SpriteBlocks } from '../shared/sprite-blocks.model';

import { Config } from '../../shared/config/env.config';

/**
 * This class represents the lazy loaded BlocklyComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'cg-blockly',
  templateUrl: 'blockly.component.html',
  styleUrls: ['blockly.component.css']
})
export class BlocklyComponent implements OnDestroy {
  constructor(private blocklyService: BlocklyService) { }

  ngOnDestroy() {
    this.blocklyService.destroyWorkspace();
  }

  initialiseWorkspace(challenge: Challenge, isSandbox: boolean, getActiveSprites: Function, savedState?: string) {
    const blocklyDiv = document.getElementById('blockly-div');
    const toolboxDiv = document.getElementById('toolbox');
    const initialBlockDiv = document.getElementById('initial-blocks');

    this.blocklyService.createWorkspace(challenge,
                                        isSandbox,
                                        blocklyDiv,
                                        toolboxDiv,
                                        initialBlockDiv,
                                        getActiveSprites,
                                        savedState);
  }

  updateWorkspaceState(savedState: string) {
    this.blocklyService.loadWorkspaceState(savedState);
  }

  getBlocks(): Map<string, SpriteBlocks> {
    return this.blocklyService.getBlocks();
  }

  getWorkspaceState(): string {
    return this.blocklyService.getWorkspaceStateAsString();
  }

  getBlocklyHeight(): string {
    return Config.BLOCKLY_DISPLAY_SIZE.height + 'px';
  }
}
