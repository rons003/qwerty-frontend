import { Injectable } from '@angular/core';

import { Challenge } from '../shared/challenge.model';
import { Sprite } from '../shared/sprite.model';
import { SpriteBlocks } from '../shared/sprite-blocks.model';

import { BlocklyConverter } from './blockly-converter';
import { BlocklyHelper } from './blockly-helper';
import { BlocklyDefinitions } from './blockly-definitions';

declare var Blockly: any;

const workspaceKey = 'BLOCKLY_WORKSPACE';

/**
 * This class provides the Blockly service with methods to initialise a Blockly workspace.
 */
@Injectable()
export class BlocklyService {
  private challenge: Challenge;
  private isSandbox: boolean;

  private containerElement: Element;
  private toolboxElement: Element;
  private workspaceElement: Element;

  private workspace: any;
  private savedWorkspace: any;

  private sprites: Map<string, SpriteBlocks> = new Map<string, SpriteBlocks>();

  constructor() {
    BlocklyHelper.setupCustomBlocks(Blockly);
  }

  /**
   * Initialises Blockly toolbox and workspace divs and refreshes the toolbox
   * and workspace with data from the given Challenge.
   * @param {Challenge} challenge
   * @param {boolean} isSandbox
   * @param {Element} containerElement - DOM element that Blockly should be injected into
   * @param {Element} toolboxElement - DOM element for Blockly toolbox
   * @param {Element} workspaceElement - DOM element for Blockly workspace
   * @param {Function} getActiveSprites - function for getting active sprites from Phaser component
   * @param {string} workspaceState - (optional) string representation of a saved Blockly workpace
   */
  createWorkspace(challenge: Challenge,
                  isSandbox: boolean,
                  containerElement: Element,
                  toolboxElement: Element,
                  workspaceElement: Element,
                  getActiveSprites: Function,
                  workspaceState?: string): void {
    this.destroyWorkspace();

    BlocklyDefinitions.setActiveSpritesFunction(getActiveSprites);

    this.challenge = challenge;
    this.isSandbox = isSandbox;

    this.containerElement = containerElement;
    this.toolboxElement = toolboxElement;
    this.workspaceElement = workspaceElement;

    this.savedWorkspace = this.getWorkspaceStateFromString(workspaceState);

    this.initialiseWorkspaceWithToolbox(this.containerElement, this.toolboxElement);
  }

  destroyWorkspace() {
    if (this.workspace) {
      this.workspace.dispose();
      this.workspace = null;
      this.savedWorkspace = null;
    }
  }

  /**
   * Updates the challenge and refreshes the toolbox and workspace.
   * @param {Challenge} newChallenge
   */
  updateChallenge(newChallenge: Challenge): void {
    console.log('updateChallenge');
    this.challenge = newChallenge;

    // Re-initialise workspace
    this.initialiseWorkspaceWithToolbox(this.containerElement, this.toolboxElement);
  }

  /**
   * Returns a JSON object containing all blocks attached to sprites on workspace.
   */
  getBlocks(): Map<string, SpriteBlocks> {
    this.resetSpriteMap();

    // Process the code into JSON before passing
    if (this.workspace === null) {
      return new Map<string, SpriteBlocks>();
    }

    const code = Blockly.JavaScript.workspaceToCode(this.workspace);

    try {
      // tslint:disable-next-line:no-eval
      eval(code);
    } catch (e) {
      alert('CANNOT EXECUTE:\n' + e);
    }

    return this.sprites;
  }

  /**
   * Retrieves the workspace state as XML text and returns it as a string.
   * @return {string} Workspace state as string
   */
  getWorkspaceStateAsString(): string {
    const xml = Blockly.Xml.workspaceToDom(this.workspace);
    return Blockly.Xml.domToText(xml);
  }

  /**
   * Converts the given workspace state as XML text and returns it as a DOM object.
   * @return {any} Workspace state in DOM format
   */
  getWorkspaceStateFromString(state: string): any {
    if (state) {
      try {
        return Blockly.Xml.textToDom(state);
      } catch (error) {
        console.log(error);
      }
    }
    return null;
  }

  /**
   * Loads a saved workspace state. Does nothing if workspace is not initialised.
   * @param {string} state - Workspace state as string
   */
  loadWorkspaceState(state: string) {
    console.log('loadWorkspaceState');
    if (this.workspace) {
      this.savedWorkspace = this.getWorkspaceStateFromString(state);
      this.resetWorkspace(this.challenge.initialBlocks);
    }
  }

  // Toolbox and workspace functions

  /**
   * Initialise workspace with empty toolbox. In sandbox mode, workspace is
   * initialised with the predefined sandbox challenge's toolbox.
   * @param {Element} containerElement - Element that Blockly workspace should be injected into
   * @param {Element} toolboxElement - Element where toolbox is located
   */
  private initialiseWorkspaceWithToolbox(containerElement: Element, toolboxElement: Element) {
    console.log('initialiseWorkspaceWithToolbox');
    const toolboxString = this.generateToolboxString(this.challenge.toolbox);

    toolboxElement.innerHTML = toolboxString;

    this.workspace = Blockly.inject(containerElement, {
      toolbox: toolboxElement,
      collapse: false,
      comments: false,
      oneBasedIndex: true,
      scrollbars: true,
      trashcan: false,
      zoom: {
        controls: false,
        startScale: 0.8
      }
    });

    this.resetWorkspace(this.challenge.initialBlocks);
    this.resetSpriteMap();
  }

  /**
   * Sets up the workspace with a saved copy of the workspace or creates a new
   * workspace with the initial blocks given by the challenge.
   */
  private resetWorkspace(blocks: object[]) {
    console.log('resetWorkspace');
    this.workspace.clear();

    if (this.savedWorkspace) {
      Blockly.Xml.domToWorkspace(this.savedWorkspace, this.workspace);
    } else {
      const initialBlocksString = this.generateInitialBlocksString(blocks);
      const initialBlocksDom = Blockly.Xml.textToDom(initialBlocksString);
      Blockly.Xml.domToWorkspace(initialBlocksDom, this.workspace);
    }
  }

  /**
   * Updates the Blockly toolbox to the list of given blocks.
   */
  private updateToolbox(toolbox: object[]): void {
    console.log('updateToolbox');
    const toolboxString = this.generateToolboxString(toolbox);
    this.toolboxElement.innerHTML = toolboxString;
    this.workspace.updateToolbox(this.toolboxElement);
  }

  /**
   * Clears all sprites and reinitialises the sprite map.
   */
  private resetSpriteMap() {
    this.sprites = new Map<string, SpriteBlocks>();

    this.challenge.sprites.map(function(sprite: Sprite) {
      this.sprites.set(sprite.name, new SpriteBlocks());
    }, this);
  }

  private isToolboxContainsCategory(toolbox: any): boolean {
    for (const propName in toolbox) {
      return propName !== 'none';
    }
    return false;
  }

  // Block generation functions

  /**
   * Generates a string representation of a Blockly toolbox given a map of JSON
   * categories containing blocks.
   */
  private generateToolboxString(categories: any): string {
    let toolboxString = '';

    for (const propName in categories) {
      const blocks = categories[propName];

      // Generate xml block strings for each block key in this category
      let blockString = '';
      blocks.forEach(function(block: any) {
        blockString += BlocklyConverter.generateBlockWithKey(block);
      }, this);

      // If a category is defined, add it to a category block with propName as the category name
      if (propName === 'variables') {
        toolboxString += `<category name='${propName}' custom='VARIABLE'></category>`;
      } else if (propName !== 'none') {
        toolboxString += `<category name='${propName}'>${blockString}</category>`;
      } else {
        toolboxString += blockString;
      }
    }

    return toolboxString;
  }

  private generateInitialBlocksString(blocks: object[]): string {
    let initialBlocksString = '<xml style="display: none">';

    // For each given json block, generate the html block
    for (let i = 0; i < blocks.length; i++) {
      initialBlocksString += BlocklyConverter.generateBlockWithKey(blocks[i]);
    }
    initialBlocksString += '</xml>';

    return initialBlocksString;
  }
}
