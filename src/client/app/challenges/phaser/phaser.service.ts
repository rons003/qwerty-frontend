import { Injectable, Inject, EventEmitter } from '@angular/core';

import { Challenge } from '../shared/challenge.model';
import { Sprite } from '../shared/sprite.model';
import { SpriteBlocks } from '../shared/sprite-blocks.model';

import { Image } from './image.model';

import { Config } from '../../shared/config/env.config';
import { PhaserConstants } from './phaser-constants';
import { SharedConstants } from '../shared/shared-constants';

declare var Phaser: any;

//================================================================================
// TABLE OF CONTENTS
// 1. INITIALIZING VARIABLES
// 2. PHASER.COMPONENT SETUP
// 3. REQUIRED PHASER FUNCTIONS
// 4. PHASER UPDATE CALLBACK BLOCKS
// 5. ANIMATION FUNCTIONS
// 6. VERIFICATION FUNCTIONS
// 7. PHASER ASSETS SETUP FUNCTIONS
// 8. HELPER FUNCTIONS
//================================================================================

/**
 * This class provides the Phaser service with methods to create a Phaser game.
 */
@Injectable()
export class PhaserService {
  // Event for Play Mode detection
  public playModeEvent: EventEmitter<boolean> = new EventEmitter();

  // Error Alert Event for Phaser Component
  public alertErrorEvent: EventEmitter<string> = new EventEmitter();

  //================================================================================
  // INITIALIZING VARIABLES
  // Phaser imports and exports classes and data using Angular.
  //================================================================================

  private challenge: Challenge;
  private isSandbox: boolean;
  private blocks: object = {};
  private getBlocks: Function;
  private challengeClearCallback: Function;
  private challengeFailCallback: Function;
  private spriteStates: Sprite[];

  // ==================================== //
  //      PHASER AND GAME VARIABLES       //
  // ==================================== //
  // Game Variables And Object
  private gameLength: number;
  private phaserWidth: number;
  private phaserHeight: number;
  private game: any;
  private grid: any;
  private selectorSprites: any = [];
  private isInPlayMode: boolean;
  private isSpritesReady = false;
  private sprites: Map<string, any> = new Map<string, any>();
  private lastClickedSprite: any;

  // Keyboard Inputs AND Helper Booleans To Ensure Only 1 Key Input Read
  private upPressed: boolean;
  private downPressed: boolean;
  private leftPressed: boolean;
  private rightPressed: boolean;
  private aPressed: boolean;
  private bPressed: boolean;
  private cPressed: boolean;
  private dPressed: boolean;
  private ePressed: boolean;
  private fPressed: boolean;
  private gPressed: boolean;
  private hPressed: boolean;
  private iPressed: boolean;
  private jPressed: boolean;
  private kPressed: boolean;
  private lPressed: boolean;
  private mPressed: boolean;
  private nPressed: boolean;
  private oPressed: boolean;
  private pPressed: boolean;
  private qPressed: boolean;
  private rPressed: boolean;
  private sPressed: boolean;
  private tPressed: boolean;
  private uPressed: boolean;
  private vPressed: boolean;
  private wPressed: boolean;
  private xPressed: boolean;
  private yPressed: boolean;
  private zPressed: boolean;

  //Hotkeys
  private arrowKeys: any;
  private charAkey: any;
  private charBkey: any;
  private charCkey: any;
  private charDkey: any;
  private charEkey: any;
  private charFkey: any;
  private charGkey: any;
  private charHkey: any;
  private charIkey: any;
  private charJkey: any;
  private charKkey: any;
  private charLkey: any;
  private charMkey: any;
  private charNkey: any;
  private charOkey: any;
  private charPkey: any;
  private charQkey: any;
  private charRkey: any;
  private charSkey: any;
  private charTkey: any;
  private charUkey: any;
  private charVkey: any;
  private charWkey: any;
  private charXkey: any;
  private charYkey: any;
  private charZkey: any;

  // Keyboard Input for Sprite Deletion
  private keyDelete: any;
  private keyBackspace: any;

  // Phaser Inbuilt-Graphics For Pendown
  private graphics: any;

  // Sounds
  private soundClick: any;
  private soundCorrect: any;

  // Score UI - NOTE: Might be changed if textUI is implemented
  private score: number;
  private scoreText: any;

  // Stores all variables
  private gameVariables: Map<string, number> = new Map<string, number>();

  //Speech
  private speechText: any;
  private speechBubble: any;

  //================================================================================
  // PHASER.COMPONENT SETUP
  // Phaser imports and exports classes and data using Angular.
  //================================================================================

  /**
   * Creates a new PhaserService.
   * @constructor
   */
  constructor() {
    // empty
  }

  /**
   * Initialises Phaser game with data from the given Challenge and sprite states.
   * @param {Element} containerElement - DOM element that Phaser should be injected into
   * @param {Challenge} challenge - Challenge that should be loaded
   * @param {boolean} isSandbox
   * @param {Function} getBlocks - Function that returns blocks that should be added to sprites
   * @param {Function} callback - Function that should be called when challenge is cleared
   * @param {Sprite[]} spriteStates - List of Sprites that represent a saved Phaser state
   */
  setupGame(containerElement: Element, challenge: Challenge, isSandbox: boolean,
    getBlocks: Function, spriteStates?: Sprite[], clearCallback?: Function, failCallback?: Function) {
    this.destroyGame();

    this.isSandbox = isSandbox;
    this.getBlocks = getBlocks;

    this.challenge = challenge;

    if (this.isSandbox) {
      challenge.instructions = 'Sandbox mode';
    } else {
      this.challengeClearCallback = clearCallback;
      this.challengeFailCallback = failCallback;
    }

    this.spriteStates = spriteStates;
    this.gameLength = PhaserConstants.gameLength;
    this.phaserWidth = Config.PHASER_DISPLAY_SIZE.width;
    this.phaserHeight = Config.PHASER_DISPLAY_SIZE.height;

    this.game = new Phaser.Game(this.phaserWidth,
      this.phaserHeight,
      Phaser.CANVAS,
      containerElement,
      {
        preload: this.preload.bind(this),
        create: this.create.bind(this),
        update: this.update.bind(this)
      });
  }

  /**
   * Updates the challenge. If a game exists, it is restarted to the
   * latest Challenge data and sprites are reset.
   * @param {Challenge} newChallenge
   */
  updateChallenge(newChallenge: Challenge) {
    this.challenge = newChallenge;

    if (this.game) {
      this.resetSprites();
      this.game.state.start(this.game.state.current);
    }
  }

  /**
   * Loads the given sprite states in the game. If a game exists, it is restarted
   * to the latest Challenge data and sprites are reset.
   * @param {Sprite[]} spriteStates
   */
  loadSpriteStates(spriteStates: Sprite[]) {
    if (this.game && spriteStates) {
      this.spriteStates = spriteStates;
      this.resetSprites();
      this.game.state.start(this.game.state.current);
    }
  }

  destroyGame() {
    if (this.game) {
      this.game.destroy();
      this.game = null;
      this.resetSprites();
    }
  }

  /**
   * Returns a list of Sprites representing a saved Phaser state.
   * @return {Sprite[]} - List of sprite states
   */
  getSpriteStates(): Sprite[] {
    const spritesToSave: Sprite[] = [];
    this.sprites.forEach(function (sprite: any, key: string) {
      const spriteToSave = new Sprite();
      spriteToSave.key = key;
      spriteToSave.name = key;
      spriteToSave.x = sprite.initial.x / this.phaserWidth * this.gameLength;
      spriteToSave.y = sprite.initial.y / this.phaserHeight * this.gameLength;
      spriteToSave.width = sprite.width / this.phaserWidth * this.gameLength;
      spriteToSave.height = sprite.height / this.phaserWidth * this.gameLength;
      spriteToSave.enabled = true;
      spritesToSave.push(spriteToSave);
    }, this);
    return spritesToSave;
  }

  pressPlay() {
    this.setPlayMode(true);
    this.playClickSound();
    this.toggleVisibilityOfGrid();
    this.removeHighlightAndDeselectLastClickedSprite();

    this.score = 0;
    this.gameVariables = new Map<string, number>();

    // Setup certain properties on each sprite
    this.sprites.forEach(function (phaserSprite: any) {
      if (this.isSandbox) {
        this.disableSelectableAndDragging(phaserSprite);
      }

      // Save current pos as initial pos
      phaserSprite.initial.x = phaserSprite.x;
      phaserSprite.initial.y = phaserSprite.y;
      phaserSprite.lastFrameX = phaserSprite.x;
      phaserSprite.lastFrameY = phaserSprite.y;

      // Reset defaults for drawing
      phaserSprite.drawing.isDown = false;
      phaserSprite.drawing.lineColour = this.convertHexstringToHex('#ff6600');
      phaserSprite.drawing.width = 5;

      phaserSprite.speed = 0.2;

      phaserSprite.finishedTweening = false;
    }, this);

    // Disable input of UI
    this.selectorSprites.forEach(function (selectorSprite: any) {
      selectorSprite.inputEnabled = false;
    });

    this.setupBlocksOnSprites(this.getBlocks());

    this.sprites.forEach(function (phaserSprite: any) {
      // Displays score UI if there exist score blocks
      if (this.hasScoreBlocks(phaserSprite)) {
        this.showAndUpdateScoreText();
      }

      this.setupClickListener(phaserSprite);

      // Each sprite executes its startBlocks
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.startBlocks), true);
    }, this);
  }

  pressExit() {
    console.log('ex');
    this.setPlayMode(false);

    this.playClickSound();
    this.toggleVisibilityOfGrid();
    this.graphics.clear();
    this.scoreText.visible = false;


    this.sprites.forEach(function (phaserSprite: any) {
      if (this.isSandbox) {
        this.enableSelectableAndDragging(phaserSprite);
      } else {
        phaserSprite.inputEnablHTMLOptGroupElemented = false;
      }

      phaserSprite.x = phaserSprite.initial.x;
      phaserSprite.y = phaserSprite.initial.y;
      phaserSprite.angle = 0;

      if (phaserSprite.tween) {
        phaserSprite.tween.stop();
        phaserSprite.tween = undefined;
      }
    }, this);

    // Reenable all the selector sprites
    this.selectorSprites.forEach(function (selectorSprite: any) {
      selectorSprite.inputEnabled = true;
    });
  }

  /**
   * Returns string array of sprite keys, for dynamic selector's use.
   *
   * Sprite keys generated from this.sprites or challenge if this.sprites is not ready yet.
   * @returns {string[]}
   */
  getActiveSprites(): string[] {
    let activeSpriteKeys: string[] = [];
    if (!this.isSpritesReady) {
      activeSpriteKeys = this.getActiveSpritesFromChallenge();
    } else {
      this.sprites.forEach(function (sprite) {
        activeSpriteKeys.push(sprite.name);
      });
    }
    return activeSpriteKeys;
  }

  //================================================================================
  // REQUIRED PHASER FUNCTIONS
  // preload, create, update
  //================================================================================

  private preload() {
    // Background
    this.game.load.image('Grid', './assets/img/grid.png');
    this.game.load.image('black', './assets/img/black.png');
    this.game.load.image('Say', './assets/img/sprites/speech.png');
    // Sprites
    for (let i = 0; i < PhaserConstants.spriteImages.length; i++) {
      const image: Image = PhaserConstants.spriteImages[i];
      this.game.load.image(image.id, image.source);
    }

    // UI Sounds
    this.game.load.audio('Click', './assets/media/click.mp3');
    this.game.load.audio('Correct', './assets/media/correct.wav');
  }

  private create() {
    this.game.stage.backgroundColor = '#FFFFFF';

    this.setupGrid();
    this.setupGraphics();
    this.setupButtons();
    this.setupPhysics();
    this.setupKeyboardInputs();

    if (this.isSandbox) {
      this.setupSandboxDisplay();
      this.setupSandboxSelectorSprites();
    } else {
      this.setupSprites();
    }

    this.isSpritesReady = true;

    this.setPlayMode(false);
    this.upPressed = false;
    this.downPressed = false;
    this.leftPressed = false;
    this.rightPressed = false;
    this.aPressed = false;
    this.bPressed = false;
    this.cPressed = false;
    this.dPressed = false;
    this.ePressed = false;
    this.fPressed = false;
    this.gPressed = false;
    this.hPressed = false;
    this.iPressed = false;
    this.jPressed = false;
    this.kPressed = false;
    this.lPressed = false;
    this.mPressed = false;
    this.nPressed = false;
    this.oPressed = false;
    this.pPressed = false;
    this.qPressed = false;
    this.rPressed = false;
    this.sPressed = false;
    this.tPressed = false;
    this.uPressed = false;
    this.vPressed = false;
    this.wPressed = false;
    this.xPressed = false;
    this.yPressed = false;
    this.zPressed = false;

    // Setup score and score display for score block's use
    // Will be invisible by default to be enabled later by score block
    this.score = 0;
    this.scoreText = this.game.add.text(5, 40, 'Score: 0', { fontSize: '20px', fill: '#000' });
    this.scoreText.visible = false;
  }

  private update() {
    if (this.isInPlayMode) {
      this.setupLettersInput();
      this.manageKeyboardInputs();
      this.sprites.forEach(function (phaserSprite: any) {
        // =================================== //
        //           GRAPHICS PENDOWN          //
        // =================================== //
        this.drawPenDown(phaserSprite);

        // =================================== //
        //    KEYBOARD INPUT AND ANIMATION     //
        // =================================== //
        if (this.upPressed || this.downPressed
          || this.leftPressed || this.rightPressed
          || this.aPressed || this.bPressed || this.cPressed || this.dPressed
          || this.ePressed || this.fPressed || this.gPressed || this.hPressed
          || this.iPressed || this.jPressed || this.kPressed || this.lPressed
          || this.mPressed || this.nPressed || this.oPressed || this.pPressed
          || this.qPressed || this.rPressed || this.sPressed || this.tPressed
          || this.uPressed || this.vPressed || this.wPressed || this.xPressed
          || this.yPressed || this.zPressed) {
          this.animateKeyboardEvent(phaserSprite);
        }

        // =================================== //
        //  COLLISION DETECTION AND ANIMATION  //
        // =================================== //
        this.checkAndAnimateCollisionEvent(phaserSprite);
      }, this);
    }
  }

  //================================================================================
  // PHASER UPDATE CALLBACK BLOCKS
  // Functions to call during the update cycle, - Pendown, Keyboard, and Collision
  //================================================================================

  private drawPenDown(phaserSprite: any) {
    if (phaserSprite.drawing.isDown) {
      this.graphics.lineStyle(phaserSprite.drawing.width, phaserSprite.drawing.lineColour);
      this.graphics.moveTo(phaserSprite.lastFrameX, phaserSprite.lastFrameY);
      this.graphics.lineTo(phaserSprite.x, phaserSprite.y);
    }
    phaserSprite.lastFrameX = phaserSprite.x;
    phaserSprite.lastFrameY = phaserSprite.y;
  }

  private animateKeyboardEvent(phaserSprite: any) {
    if (this.upPressed && phaserSprite.upBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.upBlocks));
    } else if (this.downPressed && phaserSprite.downBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.downBlocks));
    } else if (this.leftPressed && phaserSprite.leftBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.leftBlocks));
    } else if (this.rightPressed && phaserSprite.rightBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.rightBlocks));
    } else if (this.aPressed && phaserSprite.aBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.aBlocks));
    } else if (this.bPressed && phaserSprite.bBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.bBlocks));
    } else if (this.cPressed && phaserSprite.cBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.cBlocks));
    } else if (this.dPressed && phaserSprite.dBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.dBlocks));
    } else if (this.ePressed && phaserSprite.eBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.eBlocks));
    } else if (this.fPressed && phaserSprite.fBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.fBlocks));
    } else if (this.gPressed && phaserSprite.gBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.gBlocks));
    } else if (this.hPressed && phaserSprite.hBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.hBlocks));
    } else if (this.iPressed && phaserSprite.iBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.iBlocks));
    } else if (this.jPressed && phaserSprite.jBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.jBlocks));
    } else if (this.kPressed && phaserSprite.kBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.kBlocks));
    } else if (this.lPressed && phaserSprite.lBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.lBlocks));
    } else if (this.mPressed && phaserSprite.mBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.mBlocks));
    } else if (this.nPressed && phaserSprite.nBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.nBlocks));
    } else if (this.oPressed && phaserSprite.oBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.oBlocks));
    } else if (this.pPressed && phaserSprite.pBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.pBlocks));
    } else if (this.qPressed && phaserSprite.qBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.qBlocks));
    } else if (this.rPressed && phaserSprite.rBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.rBlocks));
    } else if (this.sPressed && phaserSprite.sBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.sBlocks));
    } else if (this.tPressed && phaserSprite.tBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.tBlocks));
    } else if (this.uPressed && phaserSprite.uBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.uBlocks));
    } else if (this.vPressed && phaserSprite.vBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.vBlocks));
    } else if (this.wPressed && phaserSprite.wBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.wBlocks));
    } else if (this.xPressed && phaserSprite.xBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.xBlocks));
    } else if (this.yPressed && phaserSprite.yBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.yBlocks));
    } else if (this.zPressed && phaserSprite.zBlocks.length !== 0) {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.zBlocks));
    }
  }

  private checkAndAnimateCollisionEvent(phaserSprite: any) {
    for (const targetSpriteName in phaserSprite.collideBlocks) {
      const targetSprite: any = this.sprites.get(targetSpriteName);
      this.game.physics.arcade.collide(phaserSprite, targetSprite, (function () {
        this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.collideBlocks[targetSpriteName]));
      }), null, this);
    }
  }

  //================================================================================
  // ANIMATION FUNCTIONS
  // Functions called when Play is pressed - How blocks are processed
  //================================================================================

  /**
    * Checks and assigns starting blocks (if any) for each sprite.
    * @param {Map<String, SpriteBlocks>} blocks
    */
  private setupBlocksOnSprites(blockMap: Map<string, SpriteBlocks>) {
    this.sprites.forEach(function (phaserSprite: any) {
      const spriteBlocks: SpriteBlocks = blockMap.get(phaserSprite.name);
      if (spriteBlocks) {
        phaserSprite.startBlocks = spriteBlocks.startBlocks;
        phaserSprite.clickBlocks = spriteBlocks.clickBlocks;
        phaserSprite.collideBlocks = spriteBlocks.collideBlocks;
        phaserSprite.receiveBlocks = spriteBlocks.receiveBlocks;
        phaserSprite.upBlocks = spriteBlocks.upBlocks;
        phaserSprite.downBlocks = spriteBlocks.downBlocks;
        phaserSprite.leftBlocks = spriteBlocks.leftBlocks;
        phaserSprite.rightBlocks = spriteBlocks.rightBlocks;
        phaserSprite.aBlocks = spriteBlocks.aBlocks;
        phaserSprite.bBlocks = spriteBlocks.bBlocks;
        phaserSprite.cBlocks = spriteBlocks.cBlocks;
        phaserSprite.dBlocks = spriteBlocks.dBlocks;
        phaserSprite.eBlocks = spriteBlocks.eBlocks;
        phaserSprite.fBlocks = spriteBlocks.fBlocks;
        phaserSprite.gBlocks = spriteBlocks.gBlocks;
        phaserSprite.hBlocks = spriteBlocks.hBlocks;
        phaserSprite.iBlocks = spriteBlocks.iBlocks;
        phaserSprite.jBlocks = spriteBlocks.jBlocks;
        phaserSprite.kBlocks = spriteBlocks.kBlocks;
        phaserSprite.lBlocks = spriteBlocks.lBlocks;
        phaserSprite.mBlocks = spriteBlocks.mBlocks;
        phaserSprite.nBlocks = spriteBlocks.nBlocks;
        phaserSprite.oBlocks = spriteBlocks.oBlocks;
        phaserSprite.pBlocks = spriteBlocks.pBlocks;
        phaserSprite.qBlocks = spriteBlocks.qBlocks;
        phaserSprite.rBlocks = spriteBlocks.rBlocks;
        phaserSprite.sBlocks = spriteBlocks.sBlocks;
        phaserSprite.tBlocks = spriteBlocks.tBlocks;
        phaserSprite.uBlocks = spriteBlocks.uBlocks;
        phaserSprite.vBlocks = spriteBlocks.vBlocks;
        phaserSprite.wBlocks = spriteBlocks.wBlocks;
        phaserSprite.xBlocks = spriteBlocks.xBlocks;
        phaserSprite.yBlocks = spriteBlocks.yBlocks;
        phaserSprite.zBlocks = spriteBlocks.zBlocks;
      }
    }, this);
  }

  /**
   * Parses, creates, and plays the tween for the current block,
   * then recursively calls this function for the next block.
   * If the index points to a block that does not exist, the tween is over, and verifies the solution.
   * Has 2 default arguments index & isStartBlocks
   * @param {any} phaserSprite
   * @param {any} blocks
   * @param {number} index
   * @param {boolean} isStartBlocks
   */
  private executeBlock(phaserSprite: any, blocks: any, isStartBlocks: boolean = false) {
    // This ensures that sprites do not tween outside play mode.
    // Due to execution errors, phaser is sometimes bumped out of playmode in between tweens.
    if (!this.isInPlayMode) {
      return;
    }

    // This ensures that you cannot start a new tween in the middle of a tween.
    // For example, you cannot start a keyboard tween in the middle of a startBlock tween.
    const isTweening = phaserSprite.tween;
    if (isTweening) {
      return;
    }

    // When blocks.length === 0, then the current tween is over, and other tweens can begin
    // If it was a startBlock tween, we verify that the solution is correct
    if (blocks.length === 0) {
      phaserSprite.inputEnabled = true;

      if (isStartBlocks) {
        phaserSprite.finishedTweening = true;
        if (this.haveAllSpritesFinishedTweening()) {
          if (this.isCorrectSolution()) {
            this.soundCorrect.play();
            this.challengeClearCallback();
          } else if (!this.isSandbox) {
            this.challengeFailCallback();
          }

          // DESIGN DECISION: Feature temporarily disabled
          // See autoExitPlayIfAnimationOver() for more details
          // this.autoExitPlayIfAnimationOver();
        }
      }
      return;
    }

    const block = blocks[0];
    const subsequentBlocks = blocks.slice(1);

    // If the current block is a VARIABLES_GET block, retrieve the value
    // If the current block is a RANDOM_NUMBER block, random a value
    if (block.values !== undefined) {
      // Convert variable references to their values in gameVariables
      for (let i = 0; i < block.values.length; i++) {
        const value = block.values[i];
        switch (value.key) {
          case SharedConstants.VARIABLES_GET:
            const variableName = value.values[0];
            if (!this.gameVariables.has(variableName)) {
              const message = PhaserConstants.getVariableUninitializedMessage(variableName);
              this.alertAndExit(message);
              return;
            }
            block.values[i] = this.gameVariables.get(variableName);
            break;
          case SharedConstants.GAKKO_RANDOM_NUMBER:
            const lowerBound = value.values[0];
            const upperBound = value.values[1];
            if (upperBound < lowerBound) {
              this.alertAndExit(PhaserConstants.ERROR_RANDOM);
              return;
            }
            block.values[i] = this.game.rnd.integerInRange(lowerBound, upperBound);
            break;
        }
      }
    }

    // Set duration to distance / speed
    let duration;
    if (block.values && typeof block.values[0] === 'number') {
      duration = Math.abs(block.values[0]) / phaserSprite.speed;
    } else {
      duration = 100 / phaserSprite.speed;
    }

    // There are 2 kinds of blocks:
    // 1) Blocks that require time - we create a tween and when that tween is over, the next block is executed
    // 2) Blocks that do not require any time - the next block is immediately executed
    let convertedDistanceX, convertedDistanceY;
    switch (block.key) {
      case SharedConstants.GAKKO_CONTROLS_REPEAT:
        if (block.values[0] < 0 || block.values[0] > 1000) {
          this.alertAndExit(PhaserConstants.ERROR_LOOP_NUMBER);
          return;
        }
        const expandedLoopBlocks = this.expandLoopBlock(block);
        blocks = expandedLoopBlocks.concat(blocks.slice(1));
        this.executeBlock(phaserSprite, blocks, isStartBlocks);
        break;
      case SharedConstants.GAKKO_SCORE_CHANGE:
        this.score += block.values[0];
        this.showAndUpdateScoreText();
        this.executeBlock(phaserSprite, subsequentBlocks, isStartBlocks);
        break;
      case SharedConstants.GAKKO_MOVEMENT_JUMP:
        convertedDistanceY = this.convertGameCoordsToPhaserCoords(100);

        phaserSprite.tween = this.game.add.tween(phaserSprite);
        phaserSprite.tween.to({ y: phaserSprite.y - convertedDistanceY }, duration);
        phaserSprite.tween.to({ angle: phaserSprite.angle + 360 }, 500);
        phaserSprite.tween.to({ y: phaserSprite.y }, duration);
        phaserSprite.tween.start();
        this.addOnCompleteCallback(phaserSprite, subsequentBlocks, isStartBlocks);
        break;
      case SharedConstants.GAKKO_MOVEMENT_JUMP_HEIGHT:
        convertedDistanceY = this.convertGameCoordsToPhaserCoords(block.values[0]);

        phaserSprite.tween = this.game.add.tween(phaserSprite);
        phaserSprite.tween.to({ y: phaserSprite.y - convertedDistanceY }, duration);
        phaserSprite.tween.to({ angle: phaserSprite.angle + 360 }, 500);
        phaserSprite.tween.to({ y: phaserSprite.y }, duration);
        phaserSprite.tween.start();
        this.addOnCompleteCallback(phaserSprite, subsequentBlocks, isStartBlocks);
        break;
      case SharedConstants.GAKKO_MOVEMENT_FORWARD:
        const deltaX = Math.cos(Phaser.Math.degToRad(phaserSprite.angle)) * block.values[0];
        const deltaY = Math.sin(Phaser.Math.degToRad(phaserSprite.angle)) * block.values[0];
        convertedDistanceX = this.convertGameCoordsToPhaserCoords(deltaX);
        convertedDistanceY = this.convertGameCoordsToPhaserCoords(deltaY);

        phaserSprite.tween = this.game.add.tween(phaserSprite);
        phaserSprite.tween.to({
          x: phaserSprite.position.x + convertedDistanceX,
          y: phaserSprite.position.y + convertedDistanceY
        }, duration);
        phaserSprite.tween.start();
        this.addOnCompleteCallback(phaserSprite, subsequentBlocks, isStartBlocks);
        break;
      case SharedConstants.GAKKO_MOVEMENT_ROTATE:
      case SharedConstants.GAKKO_MOVEMENT_ROTATE_EASY:
        phaserSprite.tween = this.game.add.tween(phaserSprite);
        phaserSprite.tween.to({ angle: phaserSprite.angle - block.values[0] }, duration);
        phaserSprite.tween.start();
        this.addOnCompleteCallback(phaserSprite, subsequentBlocks, isStartBlocks);
        break;
      case SharedConstants.GAKKO_MOVEMENT_MOVE_X:
        convertedDistanceX = this.convertGameCoordsToPhaserCoords(block.values[0]);

        phaserSprite.tween = this.game.add.tween(phaserSprite);
        phaserSprite.tween.to({ x: phaserSprite.position.x + convertedDistanceX }, duration);
        phaserSprite.tween.start();
        this.addOnCompleteCallback(phaserSprite, subsequentBlocks, isStartBlocks);
        break;
      case SharedConstants.GAKKO_MOVEMENT_MOVE_Y:
        convertedDistanceY = this.convertGameCoordsToPhaserCoords(block.values[0]);

        phaserSprite.tween = this.game.add.tween(phaserSprite);
        phaserSprite.tween.to({ y: phaserSprite.position.y - convertedDistanceY }, duration);
        phaserSprite.tween.start();
        this.addOnCompleteCallback(phaserSprite, subsequentBlocks, isStartBlocks);
        break;
      case SharedConstants.GAKKO_MOVEMENT_MOVE_X_Y:
        convertedDistanceX = this.convertGameCoordsToPhaserCoords(block.values[0]);
        convertedDistanceY = this.convertGameCoordsToPhaserCoords(block.values[1]);

        phaserSprite.tween = this.game.add.tween(phaserSprite);
        phaserSprite.tween.to({
          x: phaserSprite.position.x + convertedDistanceX,
          y: phaserSprite.position.y - convertedDistanceY
        }, duration);
        phaserSprite.tween.start();
        this.addOnCompleteCallback(phaserSprite, subsequentBlocks, isStartBlocks);
        break;
      case SharedConstants.GAKKO_MOVEMENT_CHANGE_X_BY:
        convertedDistanceX = this.convertGameCoordsToPhaserCoords(block.values[0]);

        phaserSprite.position.x += convertedDistanceX;
        this.executeBlock(phaserSprite, subsequentBlocks, isStartBlocks);
        break;
      case SharedConstants.GAKKO_MOVEMENT_CHANGE_Y_BY:
        convertedDistanceY = this.convertGameCoordsToPhaserCoords(block.values[0]);

        phaserSprite.position.y -= convertedDistanceY;
        this.executeBlock(phaserSprite, subsequentBlocks, isStartBlocks);
        break;
      case SharedConstants.GAKKO_MOVEMENT_SET_POSITION:
        convertedDistanceX = this.convertGameCoordsToPhaserCoords(block.values[0]);
        convertedDistanceY = this.convertGameCoordsToPhaserCoords(block.values[1]);

        phaserSprite.position.x = convertedDistanceX;
        phaserSprite.position.y = this.phaserHeight - convertedDistanceY;
        this.executeBlock(phaserSprite, subsequentBlocks, isStartBlocks);
        break;
      case SharedConstants.GAKKO_MOVEMENT_SET_SPEED:
        switch (block.values[0]) {
          case SharedConstants.SPEED_SETTING_SLOW:
            phaserSprite.speed = 0.1;
            break;
          case SharedConstants.SPEED_SETTING_NORMAL:
            phaserSprite.speed = 0.2;
            break;
          case SharedConstants.SPEED_SETTING_FAST:
            phaserSprite.speed = 0.5;
            break;
        }
        this.executeBlock(phaserSprite, subsequentBlocks, isStartBlocks);
        break;
      case SharedConstants.GAKKO_MOVEMENT_WAIT:
        const waitTime = block.values[0];
        if (waitTime < 0) {
          this.alertAndExit(PhaserConstants.ERROR_WAIT);
          return;
        }
        phaserSprite.tween = this.game.add.tween(phaserSprite);
        phaserSprite.tween.to(null, 1000 * block.values[0]);
        phaserSprite.tween.start();
        this.addOnCompleteCallback(phaserSprite, subsequentBlocks, isStartBlocks);
        break;
      case SharedConstants.GAKKO_DRAWING_PEN_ALL:
        if (block.values[2] < 0) {
          this.alertAndExit(PhaserConstants.ERROR_PEN_ALL);
          return;
        }
        phaserSprite.drawing.isDown = block.values[0];
        phaserSprite.drawing.lineColour = this.convertHexstringToHex(block.values[1]);
        phaserSprite.drawing.width = block.values[2];
        this.executeBlock(phaserSprite, subsequentBlocks, isStartBlocks);
        break;
      case SharedConstants.GAKKO_DRAWING_PEN_DOWN:
        phaserSprite.drawing.isDown = true;
        this.executeBlock(phaserSprite, subsequentBlocks, isStartBlocks);
        break;
      case SharedConstants.GAKKO_DRAWING_PEN_DOWN_BOOLEAN:
        phaserSprite.drawing.isDown = block.values[0];
        this.executeBlock(phaserSprite, subsequentBlocks, isStartBlocks);
        break;
      case SharedConstants.GAKKO_DRAWING_PEN_SET_SIZE:
        if (block.values[0] < 0) {
          this.alertAndExit(PhaserConstants.ERROR_PEN_SET_SIZE);
          return;
        }
        phaserSprite.drawing.width = block.values[0];
        this.executeBlock(phaserSprite, subsequentBlocks, isStartBlocks);
        break;
      case SharedConstants.GAKKO_DRAWING_PEN_SET_COLOUR:
        phaserSprite.drawing.lineColour = this.convertHexstringToHex(block.values[0]);
        this.executeBlock(phaserSprite, subsequentBlocks, isStartBlocks);
        break;
      case SharedConstants.GAKKO_DRAWING_PEN_CLEAR:
        this.graphics.clear();
        this.executeBlock(phaserSprite, subsequentBlocks, isStartBlocks);
        break;
      case SharedConstants.VARIABLES_SET:
        this.gameVariables.set(block.values[0], block.values[1]);
        this.executeBlock(phaserSprite, subsequentBlocks, isStartBlocks);
        break;
      case SharedConstants.MATH_CHANGE:
        const variableName = block.values[0];
        if (!this.gameVariables.has(variableName)) {
          const message = PhaserConstants.getVariableUninitializedMessage(variableName);
          this.alertAndExit(message);
          return;
        }
        const newValue = this.gameVariables.get(block.values[0]) + block.values[1];
        this.gameVariables.set(block.values[0], newValue);
        this.executeBlock(phaserSprite, subsequentBlocks, isStartBlocks);
        break;
      case SharedConstants.GAKKO_AUDIO_SET_SPEECH:
        this.speechBubble = this.game.add.sprite(phaserSprite.x, phaserSprite.y - 70, 'Say');
        this.speechBubble.inputEnabled = true;
        this.speechBubble.height = 20;
        this.speechBubble.width = 100;
        // tslint:disable-next-line:max-line-length
        const textStyle = { font: '14px Arial', align: 'left', wordBreak: 'breakAll', wordWrap: true, wordWrapWidth: this.speechBubble.width };
        if (block.values[1].length >= 23) {
          block.values[1] = block.values[1].slice(0, 20).concat('...');
        } else {
          block.values[1] = block.values[1].trim();
        }
        this.speechText = this.game.add.text(0, 0, block.values[1], textStyle);
        this.speechText.anchor.set(0.5, 0.5);
        const bounds = this.speechText.getLocalBounds();
        if (bounds.width + 20 > this.speechBubble.width) {
          this.speechBubble.width = bounds.width + 20;
        }
        if (bounds.height + 17 > this.speechBubble.height) {
            this.speechBubble.height = bounds.height + 17;
        }
        this.speechText.x = Math.floor(this.speechBubble.x + this.speechBubble.width / 2);
        this.speechText.y = Math.floor(this.speechBubble.y + this.speechBubble.height / 2);
        //console.log(this.speechText.height);
      break;
      case SharedConstants.GAKKO_EVENT_BROADCAST:
        this.sprites.forEach(function (phaserSprite: any) {
          //when i receive
          this.setupReceiveListener(phaserSprite);
        }, this);
        break;
      default:
        console.log(`ERROR: Block ${block.key} not found!`);
    }
  }

  private setupReceiveListener(phaserSprite: any) {
    this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.receiveBlocks));
  }
  private setupClickListener(phaserSprite: any) {
    if (phaserSprite.clickBlocks.length === 0) {
      return;
    }

    phaserSprite.inputEnabled = true;

    // MUST click the sprite, not the whitespace around it
    phaserSprite.input.pixelPerfectOver = true;
    // Cursor turns into hand when over sprite
    phaserSprite.input.useHandCursor = true;
    phaserSprite.events.onInputDown.add(function () {
      this.executeBlock(phaserSprite, this.deepCopy(phaserSprite.clickBlocks));
    }, this);
  }

  /**
   * Recursive function that expects some kind of repeat block.
   * It opens a loop block into its children
   * @param {any} loopBlock
   */
  private expandLoopBlock(loopBlock: any): object[] {
    const expandedLoopBlock: object[] = [];

    const numRepeats = loopBlock.values[0];
    for (let i = 0; i < numRepeats; i++) {
      for (const child of loopBlock.children) {
        expandedLoopBlock.push(this.deepCopy(child));
      }
    }
    return expandedLoopBlock;
  }

  private addOnCompleteCallback(phaserSprite: any, subsequentBlocks: any, isStartBlocks: boolean) {
    phaserSprite.tween.onComplete.add(function () {
      // Set to null represents the sprite is no longer tweening
      phaserSprite.tween = null;
      // Execute the next block in the list
      this.executeBlock(phaserSprite, subsequentBlocks, isStartBlocks);
    }, this);
  }

  //================================================================================
  // VERIFICATION FUNCTIONS
  //================================================================================

  private haveAllSpritesFinishedTweening() {
    let allSpritesFinishedTweening = true;
    this.sprites.forEach(function (phaserSprite: any) {
      allSpritesFinishedTweening = allSpritesFinishedTweening && phaserSprite.finishedTweening;
    }, this);
    return allSpritesFinishedTweening;
  }

  /**
   * Gets solution from data.json. Each sprite has it's own correct solution.
   * Each sprite might have multiple correct solutions.
   * If any of them match the submitted solution, it is correct
   * All sprites must be marked correct for the entire solution to be correct.
   */
  private isCorrectSolution(): boolean {
    if (this.isSandbox) {
      return false;
    }

    const spritesArray = Array.from(this.sprites.values());
    for (const phaserSprite of spritesArray) {
      const spriteCorrectPatterns = this.challenge.correctPatterns.get(phaserSprite.name);

      if (!spriteCorrectPatterns) {
        console.log('NO SOLUTION FOUND FOR LEVEL OR SPRITE');
        return false;
      }

      let doesSpriteMatchSolution = false;

      for (const spriteCorrectPattern of spriteCorrectPatterns) {
        if (!spriteCorrectPattern.startBlocks) spriteCorrectPattern.startBlocks = [];
        if (!spriteCorrectPattern.clickBlocks) spriteCorrectPattern.clickBlocks = [];
        if (!spriteCorrectPattern.receiveBlocks) spriteCorrectPattern.receiveBlocks = [];
        if (!spriteCorrectPattern.upBlocks) spriteCorrectPattern.upBlocks = [];
        if (!spriteCorrectPattern.downBlocks) spriteCorrectPattern.downBlocks = [];
        if (!spriteCorrectPattern.leftBlocks) spriteCorrectPattern.leftBlocks = [];
        if (!spriteCorrectPattern.rightBlocks) spriteCorrectPattern.rightBlocks = [];
        if (!spriteCorrectPattern.aBlocks) spriteCorrectPattern.aBlocks = [];
        if (!spriteCorrectPattern.bBlocks) spriteCorrectPattern.bBlocks = [];
        if (!spriteCorrectPattern.cBlocks) spriteCorrectPattern.cBlocks = [];
        if (!spriteCorrectPattern.dBlocks) spriteCorrectPattern.dBlocks = [];
        if (!spriteCorrectPattern.eBlocks) spriteCorrectPattern.eBlocks = [];
        if (!spriteCorrectPattern.fBlocks) spriteCorrectPattern.fBlocks = [];
        if (!spriteCorrectPattern.gBlocks) spriteCorrectPattern.gBlocks = [];
        if (!spriteCorrectPattern.hBlocks) spriteCorrectPattern.hBlocks = [];
        if (!spriteCorrectPattern.iBlocks) spriteCorrectPattern.iBlocks = [];
        if (!spriteCorrectPattern.jBlocks) spriteCorrectPattern.jBlocks = [];
        if (!spriteCorrectPattern.kBlocks) spriteCorrectPattern.kBlocks = [];
        if (!spriteCorrectPattern.lBlocks) spriteCorrectPattern.lBlocks = [];
        if (!spriteCorrectPattern.mBlocks) spriteCorrectPattern.mBlocks = [];
        if (!spriteCorrectPattern.nBlocks) spriteCorrectPattern.nBlocks = [];
        if (!spriteCorrectPattern.oBlocks) spriteCorrectPattern.oBlocks = [];
        if (!spriteCorrectPattern.pBlocks) spriteCorrectPattern.pBlocks = [];
        if (!spriteCorrectPattern.qBlocks) spriteCorrectPattern.qBlocks = [];
        if (!spriteCorrectPattern.rBlocks) spriteCorrectPattern.rBlocks = [];
        if (!spriteCorrectPattern.sBlocks) spriteCorrectPattern.sBlocks = [];
        if (!spriteCorrectPattern.tBlocks) spriteCorrectPattern.tBlocks = [];
        if (!spriteCorrectPattern.uBlocks) spriteCorrectPattern.uBlocks = [];
        if (!spriteCorrectPattern.vBlocks) spriteCorrectPattern.vBlocks = [];
        if (!spriteCorrectPattern.wBlocks) spriteCorrectPattern.wBlocks = [];
        if (!spriteCorrectPattern.xBlocks) spriteCorrectPattern.xBlocks = [];
        if (!spriteCorrectPattern.yBlocks) spriteCorrectPattern.yBlocks = [];
        if (!spriteCorrectPattern.zBlocks) spriteCorrectPattern.zBlocks = [];
        if (!spriteCorrectPattern.collideBlocks) spriteCorrectPattern.collideBlocks = {};

        if (this.objectsEqual(phaserSprite.startBlocks, spriteCorrectPattern.startBlocks) &&
          this.objectsEqual(phaserSprite.clickBlocks, spriteCorrectPattern.clickBlocks) &&
          this.objectsEqual(phaserSprite.receiveBlocks, spriteCorrectPattern.receiveBlocks) &&
          this.objectsEqual(phaserSprite.upBlocks, spriteCorrectPattern.upBlocks) &&
          this.objectsEqual(phaserSprite.downBlocks, spriteCorrectPattern.downBlocks) &&
          this.objectsEqual(phaserSprite.leftBlocks, spriteCorrectPattern.leftBlocks) &&
          this.objectsEqual(phaserSprite.rightBlocks, spriteCorrectPattern.rightBlocks) &&
          this.objectsEqual(phaserSprite.aBlocks, spriteCorrectPattern.aBlocks) &&
          this.objectsEqual(phaserSprite.bBlocks, spriteCorrectPattern.bBlocks) &&
          this.objectsEqual(phaserSprite.cBlocks, spriteCorrectPattern.cBlocks) &&
          this.objectsEqual(phaserSprite.dBlocks, spriteCorrectPattern.dBlocks) &&
          this.objectsEqual(phaserSprite.eBlocks, spriteCorrectPattern.eBlocks) &&
          this.objectsEqual(phaserSprite.fBlocks, spriteCorrectPattern.fBlocks) &&
          this.objectsEqual(phaserSprite.gBlocks, spriteCorrectPattern.gBlocks) &&
          this.objectsEqual(phaserSprite.hBlocks, spriteCorrectPattern.hBlocks) &&
          this.objectsEqual(phaserSprite.iBlocks, spriteCorrectPattern.iBlocks) &&
          this.objectsEqual(phaserSprite.jBlocks, spriteCorrectPattern.jBlocks) &&
          this.objectsEqual(phaserSprite.kBlocks, spriteCorrectPattern.kBlocks) &&
          this.objectsEqual(phaserSprite.lBlocks, spriteCorrectPattern.lBlocks) &&
          this.objectsEqual(phaserSprite.mBlocks, spriteCorrectPattern.mBlocks) &&
          this.objectsEqual(phaserSprite.nBlocks, spriteCorrectPattern.nBlocks) &&
          this.objectsEqual(phaserSprite.oBlocks, spriteCorrectPattern.oBlocks) &&
          this.objectsEqual(phaserSprite.pBlocks, spriteCorrectPattern.pBlocks) &&
          this.objectsEqual(phaserSprite.qBlocks, spriteCorrectPattern.qBlocks) &&
          this.objectsEqual(phaserSprite.rBlocks, spriteCorrectPattern.rBlocks) &&
          this.objectsEqual(phaserSprite.sBlocks, spriteCorrectPattern.sBlocks) &&
          this.objectsEqual(phaserSprite.tBlocks, spriteCorrectPattern.tBlocks) &&
          this.objectsEqual(phaserSprite.uBlocks, spriteCorrectPattern.uBlocks) &&
          this.objectsEqual(phaserSprite.vBlocks, spriteCorrectPattern.vBlocks) &&
          this.objectsEqual(phaserSprite.wBlocks, spriteCorrectPattern.wBlocks) &&
          this.objectsEqual(phaserSprite.xBlocks, spriteCorrectPattern.xBlocks) &&
          this.objectsEqual(phaserSprite.yBlocks, spriteCorrectPattern.yBlocks) &&
          this.objectsEqual(phaserSprite.zBlocks, spriteCorrectPattern.zBlocks) &&
          this.objectsEqual(phaserSprite.collideBlocks, spriteCorrectPattern.collideBlocks)) {
          doesSpriteMatchSolution = true;
        }
      }

      if (!doesSpriteMatchSolution) {
        return false;
      }
    }
    return true;
  }

  //================================================================================
  // PHASER ASSETS SETUP FUNCTIONS
  //================================================================================

  private setupGrid() {
    this.grid = this.game.add.sprite(0, 0, 'Grid');
    this.grid.width = this.game.width;
    this.grid.height = this.game.height;
    this.grid.inputEnabled = true;
    this.grid.events.onInputDown.add(this.removeHighlightAndDeselectLastClickedSprite, this);
  }

  private setupGraphics() {
    this.graphics = this.game.add.graphics(0, 0);
  }

  private setupButtons() {
    this.soundClick = this.game.add.audio('Click');
    this.soundCorrect = this.game.add.audio('Correct');

    // Add delete function only in sandbox mode
    if (this.isSandbox) {
      // Delete button
      this.keyDelete = this.game.input.keyboard.addKey(Phaser.Keyboard.DELETE);
      this.keyDelete.onDown.add(this.deleteLastClickedSprite, this);
      this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.DELETE);

      // Backspace button (for Mac, does not have delete button)
      this.keyBackspace = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
      this.keyBackspace.onDown.add(this.deleteLastClickedSprite, this);
      this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.BACKSPACE);
    }
  }

  private setupPhysics() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  }

  private setupKeyboardInputs() {
    this.arrowKeys = this.game.input.keyboard.createCursorKeys();
  }
  private setupLettersInput() {
    this.charAkey = this.game.input.keyboard.addKey(Phaser.KeyCode.A);
    this.charBkey = this.game.input.keyboard.addKey(Phaser.KeyCode.B);
    this.charCkey = this.game.input.keyboard.addKey(Phaser.KeyCode.C);
    this.charDkey = this.game.input.keyboard.addKey(Phaser.KeyCode.D);
    this.charEkey = this.game.input.keyboard.addKey(Phaser.KeyCode.E);
    this.charFkey = this.game.input.keyboard.addKey(Phaser.KeyCode.F);
    this.charGkey = this.game.input.keyboard.addKey(Phaser.KeyCode.G);
    this.charHkey = this.game.input.keyboard.addKey(Phaser.KeyCode.H);
    this.charIkey = this.game.input.keyboard.addKey(Phaser.KeyCode.I);
    this.charJkey = this.game.input.keyboard.addKey(Phaser.KeyCode.J);
    this.charKkey = this.game.input.keyboard.addKey(Phaser.KeyCode.K);
    this.charLkey = this.game.input.keyboard.addKey(Phaser.KeyCode.L);
    this.charMkey = this.game.input.keyboard.addKey(Phaser.KeyCode.M);
    this.charNkey = this.game.input.keyboard.addKey(Phaser.KeyCode.N);
    this.charOkey = this.game.input.keyboard.addKey(Phaser.KeyCode.O);
    this.charPkey = this.game.input.keyboard.addKey(Phaser.KeyCode.P);
    this.charQkey = this.game.input.keyboard.addKey(Phaser.KeyCode.Q);
    this.charRkey = this.game.input.keyboard.addKey(Phaser.KeyCode.R);
    this.charSkey = this.game.input.keyboard.addKey(Phaser.KeyCode.S);
    this.charTkey = this.game.input.keyboard.addKey(Phaser.KeyCode.T);
    this.charUkey = this.game.input.keyboard.addKey(Phaser.KeyCode.U);
    this.charVkey = this.game.input.keyboard.addKey(Phaser.KeyCode.V);
    this.charWkey = this.game.input.keyboard.addKey(Phaser.KeyCode.W);
    this.charXkey = this.game.input.keyboard.addKey(Phaser.KeyCode.X);
    this.charYkey = this.game.input.keyboard.addKey(Phaser.KeyCode.Y);
    this.charZkey = this.game.input.keyboard.addKey(Phaser.KeyCode.Z);
  }

  private setupSprites() {
    const spritesToSetup = this.spriteStates ? this.spriteStates : this.challenge.sprites;

    spritesToSetup.forEach(function (spriteToLoad: Sprite) {
      this.setupSprite(spriteToLoad);
    }, this);
  }

  /**
   * Creates sprites on stage in their appropriate positions and adds them to this.sprites.
   * If
   */
  private setupSprite(initialSpriteData: Sprite) {
    const numSprites = this.sprites.size;
    let initialX, initialY;

    if (initialSpriteData.x === undefined || initialSpriteData.y === undefined) {
      const permittedZone = PhaserConstants.defaultSpriteProperties.initialPosition.permittedZone;
      const startBuffer = PhaserConstants.defaultSpriteProperties.initialPosition.startBuffer;
      const offsetBetweenSprites = PhaserConstants.defaultSpriteProperties.initialPosition.offsetBetweenSprites;

      const permittedZoneLength = this.gameLength - 2 * permittedZone;
      const firstSpriteX = permittedZoneLength + startBuffer;
      const firstSpriteY = permittedZoneLength - startBuffer;
      const offset = numSprites * offsetBetweenSprites;

      initialX = permittedZone + (firstSpriteX + offset) % permittedZoneLength;
      initialY = permittedZone + (firstSpriteY + offset) % permittedZoneLength;
    } else {
      initialX = initialSpriteData.x;
      initialY = initialSpriteData.y;
    }
    initialX = this.convertGameCoordsToPhaserCoords(initialX);
    initialY = this.convertGameCoordsToPhaserCoords(initialY);

    const phaserSprite = this.game.add.sprite(initialX, initialY, initialSpriteData.name);

    const spriteWidth = initialSpriteData.width === undefined
      ? this.convertGameCoordsToPhaserCoords(PhaserConstants.defaultSpriteProperties.length)
      : this.convertGameCoordsToPhaserCoords(initialSpriteData.width);
    const spriteHeight = initialSpriteData.height === undefined
      ? this.convertGameCoordsToPhaserCoords(PhaserConstants.defaultSpriteProperties.length)
      : this.convertGameCoordsToPhaserCoords(initialSpriteData.height);

    // Set up for Phaser Sprite
    phaserSprite.anchor.set(0.5);
    phaserSprite.width = spriteWidth;
    phaserSprite.height = spriteHeight;
    phaserSprite.initial = {};
    phaserSprite.initial.x = initialX;
    phaserSprite.initial.y = initialY;

    phaserSprite.startBlocks = [];
    phaserSprite.clickBlocks = [];
    phaserSprite.collideBlocks = {};
    phaserSprite.receiveBlocks = [];
    phaserSprite.upBlocks = [];
    phaserSprite.downBlocks = [];
    phaserSprite.leftBlocks = [];
    phaserSprite.rightBlocks = [];
    phaserSprite.aBlocks = [];
    phaserSprite.bBlocks = [];
    phaserSprite.cBlocks = [];
    phaserSprite.dBlocks = [];
    phaserSprite.eBlocks = [];
    phaserSprite.fBlocks = [];
    phaserSprite.gBlocks = [];
    phaserSprite.hBlocks = [];
    phaserSprite.iBlocks = [];
    phaserSprite.jBlocks = [];
    phaserSprite.kBlocks = [];
    phaserSprite.lBlocks = [];
    phaserSprite.mBlocks = [];
    phaserSprite.nBlocks = [];
    phaserSprite.oBlocks = [];
    phaserSprite.pBlocks = [];
    phaserSprite.qBlocks = [];
    phaserSprite.rBlocks = [];
    phaserSprite.sBlocks = [];
    phaserSprite.tBlocks = [];
    phaserSprite.uBlocks = [];
    phaserSprite.vBlocks = [];
    phaserSprite.wBlocks = [];
    phaserSprite.xBlocks = [];
    phaserSprite.yBlocks = [];
    phaserSprite.zBlocks = [];

    // For Drawing Lines
    phaserSprite.drawing = {};

    // Physics
    this.game.physics.enable(phaserSprite, Phaser.Physics.ARCADE);

    // For dyanmic dropdown
    phaserSprite.name = initialSpriteData.name;
    this.sprites.set(initialSpriteData.name, phaserSprite);

    if (this.isSandbox) {
      this.enableSelectableAndDragging(phaserSprite);
    }

    return phaserSprite;
  }

  /**
   * SANDBOX ONLY: Creates UI sprite buttons that add sprites
   */
  private setupSandboxDisplay() {
    this.game.add.sprite(0, 5 / 6 * this.phaserHeight, 'black');
    this.game.world.setBounds(0, 0, this.phaserWidth, 5 / 6 * this.phaserHeight);
  }

  private setupSandboxSelectorSprites() {
    this.selectorSprites = [];

    this.challenge.sprites.forEach(function (challengeDataSprite: Sprite) {
      this.setupSelectorSprite(challengeDataSprite);
    }, this);
  }

  private setupSelectorSprite(challengeDataSprite: Sprite) {
    const numSelectorSprites = this.selectorSprites.length;
    const x = PhaserConstants.spriteSelectorPositions.x;
    const y = PhaserConstants.spriteSelectorPositions.y;
    const offset = PhaserConstants.spriteSelectorPositions.offsetBetweenSprites;
    let posX = x + numSelectorSprites * offset;
    let posY = y;
    posX = this.convertGameCoordsToPhaserCoords(posX);
    posY = this.convertGameCoordsToPhaserCoords(posY);

    const selectorSprite = this.game.add.sprite(posX, posY, challengeDataSprite.name);

    selectorSprite.width = 5 / 6 * this.convertGameCoordsToPhaserCoords(PhaserConstants.defaultSpriteProperties.length);
    selectorSprite.height = 5 / 6 * this.convertGameCoordsToPhaserCoords(PhaserConstants.defaultSpriteProperties.length);

    selectorSprite.anchor.set(0.5);
    selectorSprite.inputEnabled = true;
    selectorSprite.events.onInputDown.add(function () {
      this.setupSprite(challengeDataSprite);
      selectorSprite.alpha = 0.5;
      selectorSprite.inputEnabled = false;
    }, this);

    // If there is a saved spriteState, use it
    if (this.spriteStates) {
      // Check through the sprite states for a matching sprite
      this.spriteStates.forEach(function (spriteState: Sprite) {
        if (challengeDataSprite.name === spriteState.name) {
          this.setupSprite(spriteState);
          selectorSprite.alpha = 0.5;
          selectorSprite.inputEnabled = false;
        }
      }, this);
    } else {
      if (challengeDataSprite.enabled) {
        this.setupSprite(challengeDataSprite);
        selectorSprite.alpha = 0.5;
        selectorSprite.inputEnabled = false;
      }
    }

    this.selectorSprites.push(selectorSprite);

    return selectorSprite;
  }

  private resetSprites() {
    this.isSpritesReady = false;
    this.sprites = new Map<string, any>();
    this.selectorSprites = [];
  }

  //================================================================================
  // HELPER FUNCTIONS
  //================================================================================

  /**
   * Ensures that only 1 keyboard input is listened to at 1 time
   * If a button is being held down, it will not accept another button being pressed
   * this.arrowKeys.*.isDown - is the actual keyboard input
   * this.*Pressed         - is whether the input is accepted
   */
  private manageKeyboardInputs() {
    if (!this.upPressed &&
      !this.downPressed &&
      !this.leftPressed &&
      !this.rightPressed) {
      this.upPressed = this.arrowKeys.up.isDown;
      this.downPressed = this.arrowKeys.down.isDown && !this.upPressed;
      this.leftPressed = this.arrowKeys.left.isDown && !this.downPressed;
      this.rightPressed = this.arrowKeys.right.isDown && !this.rightPressed;
      this.aPressed = this.charAkey.isDown;
      this.bPressed = this.charBkey.isDown;
      this.cPressed = this.charCkey.isDown;
      this.dPressed = this.charDkey.isDown;
      this.ePressed = this.charEkey.isDown;
      this.fPressed = this.charFkey.isDown;
      this.gPressed = this.charGkey.isDown;
      this.hPressed = this.charHkey.isDown;
      this.iPressed = this.charIkey.isDown;
      this.jPressed = this.charJkey.isDown;
      this.kPressed = this.charKkey.isDown;
      this.lPressed = this.charLkey.isDown;
      this.mPressed = this.charMkey.isDown;
      this.nPressed = this.charNkey.isDown;
      this.oPressed = this.charOkey.isDown;
      this.pPressed = this.charPkey.isDown;
      this.qPressed = this.charQkey.isDown;
      this.rPressed = this.charRkey.isDown;
      this.sPressed = this.charSkey.isDown;
      this.tPressed = this.charTkey.isDown;
      this.uPressed = this.charUkey.isDown;
      this.vPressed = this.charVkey.isDown;
      this.wPressed = this.charWkey.isDown;
      this.xPressed = this.charXkey.isDown;
      this.yPressed = this.charYkey.isDown;
      this.zPressed = this.charZkey.isDown;
    } else {
      this.upPressed = this.arrowKeys.up.isDown && this.upPressed;
      this.downPressed = this.arrowKeys.down.isDown && this.downPressed;
      this.leftPressed = this.arrowKeys.left.isDown && this.leftPressed;
      this.rightPressed = this.arrowKeys.right.isDown && this.rightPressed;
      this.aPressed = this.charAkey.isDown && this.aPressed;
      this.bPressed = this.charBkey.isDown && this.bPressed;
      this.cPressed = this.charCkey.isDown && this.cPressed;
      this.dPressed = this.charDkey.isDown && this.dPressed;
      this.ePressed = this.charEkey.isDown && this.ePressed;
      this.fPressed = this.charFkey.isDown && this.fPressed;
      this.gPressed = this.charGkey.isDown && this.gPressed;
      this.hPressed = this.charHkey.isDown && this.hPressed;
      this.iPressed = this.charIkey.isDown && this.iPressed;
      this.jPressed = this.charJkey.isDown && this.jPressed;
      this.kPressed = this.charKkey.isDown && this.kPressed;
      this.lPressed = this.charLkey.isDown && this.lPressed;
      this.mPressed = this.charMkey.isDown && this.mPressed;
      this.nPressed = this.charNkey.isDown && this.nPressed;
      this.oPressed = this.charOkey.isDown && this.oPressed;
      this.pPressed = this.charPkey.isDown && this.pPressed;
      this.qPressed = this.charQkey.isDown && this.qPressed;
      this.rPressed = this.charRkey.isDown && this.rPressed;
      this.sPressed = this.charSkey.isDown && this.sPressed;
      this.tPressed = this.charTkey.isDown && this.tPressed;
      this.uPressed = this.charUkey.isDown && this.uPressed;
      this.vPressed = this.charVkey.isDown && this.vPressed;
      this.wPressed = this.charWkey.isDown && this.wPressed;
      this.xPressed = this.charXkey.isDown && this.xPressed;
      this.yPressed = this.charYkey.isDown && this.yPressed;
      this.zPressed = this.charZkey.isDown && this.zPressed;
    }
  }

  /**
   * If there are any score blocks attached, we want to instantiate the score UI when Play button is pressed.
   * This function checks all the blocks for score blocks and returns a bool.
   */
  private hasScoreBlocks(phaserSprite: any) {
    let collideBlocksContainScoreBlocks = false;
    for (const targetSpriteName in phaserSprite.collideBlocks) {
      collideBlocksContainScoreBlocks = collideBlocksContainScoreBlocks
        || this.containsScoreBlocks(phaserSprite.collideBlocks[targetSpriteName]);
    }
    return collideBlocksContainScoreBlocks
      || this.containsScoreBlocks(phaserSprite.startBlocks)
      || this.containsScoreBlocks(phaserSprite.clickBlocks)
      || this.containsScoreBlocks(phaserSprite.upBlocks)
      || this.containsScoreBlocks(phaserSprite.downBlocks)
      || this.containsScoreBlocks(phaserSprite.leftBlocks)
      || this.containsScoreBlocks(phaserSprite.rightBlocks)
      || this.containsScoreBlocks(phaserSprite.aBlocks)
      || this.containsScoreBlocks(phaserSprite.bBlocks)
      || this.containsScoreBlocks(phaserSprite.cBlocks)
      || this.containsScoreBlocks(phaserSprite.dBlocks)
      || this.containsScoreBlocks(phaserSprite.eBlocks)
      || this.containsScoreBlocks(phaserSprite.fBlocks)
      || this.containsScoreBlocks(phaserSprite.gBlocks)
      || this.containsScoreBlocks(phaserSprite.hBlocks)
      || this.containsScoreBlocks(phaserSprite.iBlocks)
      || this.containsScoreBlocks(phaserSprite.jBlocks)
      || this.containsScoreBlocks(phaserSprite.kBlocks)
      || this.containsScoreBlocks(phaserSprite.lBlocks)
      || this.containsScoreBlocks(phaserSprite.mBlocks)
      || this.containsScoreBlocks(phaserSprite.nBlocks)
      || this.containsScoreBlocks(phaserSprite.oBlocks)
      || this.containsScoreBlocks(phaserSprite.pBlocks)
      || this.containsScoreBlocks(phaserSprite.qBlocks)
      || this.containsScoreBlocks(phaserSprite.rBlocks)
      || this.containsScoreBlocks(phaserSprite.sBlocks)
      || this.containsScoreBlocks(phaserSprite.tBlocks)
      || this.containsScoreBlocks(phaserSprite.uBlocks)
      || this.containsScoreBlocks(phaserSprite.vBlocks)
      || this.containsScoreBlocks(phaserSprite.wBlocks)
      || this.containsScoreBlocks(phaserSprite.xBlocks)
      || this.containsScoreBlocks(phaserSprite.yBlocks)
      || this.containsScoreBlocks(phaserSprite.zBlocks);
  }

  private containsScoreBlocks(blocks: any[]): boolean {
    for (const block of blocks) {
      if (block.key.substring(0, 11) === 'gakko_score') {
        return true;
      }
      if (block.key === SharedConstants.GAKKO_CONTROLS_REPEAT) {
        // Return true ONLY if function returns true, else continue checking the rest of the blocks
        if (this.containsScoreBlocks(block.children)) {
          return true;
        }
      }
    }
    return false;
  }

  private showAndUpdateScoreText() {
    this.scoreText.visible = true;
    this.scoreText.text = 'Score: ' + this.score;
  }
  /**
   * Returns a deep copy of the block object
   * Changes made to the copy are not reflected on the original object
   * This is used when cloning collideBlocks, so we don't just copy a reference.
   */
  private deepCopy(blocks: any) {
    return JSON.parse(JSON.stringify(blocks));
  }

  /**
   * Checks if 2 objects are the same. Used for verification.
   * Modified from
   * https://stackoverflow.com/questions/1068834/object-comparison-in-javascript
   */
  private objectsEqual(a: any, b: any) {
    if (typeof (a) !== 'object' && typeof (b) !== 'object') {
      return a === b;
    }

    if (Array.isArray(a) && Array.isArray(b)) {
      a = this.removeIgnoredBlocks(a);
      b = this.removeIgnoredBlocks(b);
    }

    // Create arrays of property names
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length !== bProps.length) {
      return false;
    }

    for (const propName of aProps) {
      // If values of same property are not equal,
      // objects are not equivalent
      if (!this.objectsEqual(a[propName], b[propName])) {
        return false;
      }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
  }

  /**
   *  Remove blocks that should be ignored in solution verification and returns
   *  a new array without the ignored blocks.
   *  Ignore GAKKO_DRAWING_PEN_SET_SIZE and GAKKO_DRAWING_PEN_SET_COLOUR blocks
   *  and ignore colour and size values in GAKKO_DRAWING_PEN_ALL blocks.
   */
  private removeIgnoredBlocks(array: any[]) {
    let result = array.filter((block: { key: string }) => {
      return block.key !== SharedConstants.GAKKO_DRAWING_PEN_SET_SIZE &&
        block.key !== SharedConstants.GAKKO_DRAWING_PEN_SET_COLOUR;
    });

    result = result.map((block: { key: string, values: any[] }) => {
      if (block.key === SharedConstants.GAKKO_DRAWING_PEN_ALL) {
        // Ignore colour and size values
        const isPenOn = block.values[0];
        block.values = [isPenOn];
      }
      return block;
    });

    return result;
  }

  /**
   * The phaser component is can be scaled to any size, which is defined in app-constants.module.ts
   * We test at 400 x 400. However, in data.json and in phaser-constants, values are written as if the dimensions were 600 x 600.
   * When the data is passed into phaser.service.ts, the position and size is scaled down to the phaser.component.ts dimension.
   */
  private convertGameCoordsToPhaserCoords(inDistance: number): number {
    return inDistance / this.gameLength * this.phaserWidth;
  }

  private enableSelectableAndDragging(phaserSprite: any) {
    // Remove any listeners that were on it
    phaserSprite.events.onInputDown.removeAll();
    phaserSprite.inputEnabled = true;

    // MUST click the sprite, not the whitespace around it
    phaserSprite.input.pixelPerfectOver = true;

    // Cursor turns into hand when over sprite
    phaserSprite.input.useHandCursor = true;

    // Sprite cannot leave world bounds
    phaserSprite.body.collideWorldBounds = true;

    phaserSprite.events.onInputDown.add(function () {
      this.removeHighlightAndDeselectLastClickedSprite();
      this.lastClickedSprite = phaserSprite;
      this.lastClickedSprite.tint = 0xCCE5FF;
    }, this);

    // Enable Dragging
    const lockCenter = false;
    const bringToTop = true;
    const pixelPerfect = true;
    const dragWithinBackground = this.grid;
    phaserSprite.input.enableDrag(lockCenter, bringToTop, pixelPerfect, 255, null, dragWithinBackground);
    phaserSprite.events.onDragStop.add(function (phaserSprite: any) {
      phaserSprite.initial.x = phaserSprite.x;
      phaserSprite.initial.y = phaserSprite.y;
    }, this);
  }

  private disableSelectableAndDragging(phaserSprite: any) {
    // Remove any listeners that were on it
    phaserSprite.events.onInputDown.removeAll();

    phaserSprite.input.pixelPerfectOver = false;
    phaserSprite.input.useHandCursor = false;
    phaserSprite.body.collideWorldBounds = false;

    phaserSprite.input.disableDrag();
  }

  /**
    * Converts Blockly's color return hexstring #XXXXXX' (with quotations) into hex XXXXXX
    * @param {string} hexstring
    */
  private convertHexstringToHex(hexstring: string) {
    hexstring = hexstring.substr(1); //  Prune the '#' prefix' and quotation marks
    const hex = parseInt(hexstring, 16); // Convert XXXXXX from a string to hex
    return hex;
  }

  private playClickSound() {
    this.soundClick.play();
  }

  private removeHighlightAndDeselectLastClickedSprite() {
    if (this.lastClickedSprite) {
      this.lastClickedSprite.tint = 0xFFFFFF;
    }
    this.lastClickedSprite = null;
  }

  private deleteLastClickedSprite() {
    if (this.lastClickedSprite) {
      // Reenables a disabled selector sprite
      this.selectorSprites.forEach(function (selectorSprite: any) {
        if (this.lastClickedSprite.name === selectorSprite.key) {
          selectorSprite.alpha = 1;
          selectorSprite.inputEnabled = true;
        }
      }, this);

      this.sprites.delete(this.lastClickedSprite.name);
      this.lastClickedSprite.destroy();
      this.lastClickedSprite = null;
    }
  }

  private toggleVisibilityOfGrid() {
    this.grid.visible = !this.grid.visible;
    this.grid.inputEnabled = !this.grid.inputEnabled;
  }

  /**
   * Returns array of sprite keys listed in saved state or challenge.
   *
   * To be called only when this.sprites is not ready yet. Such as during initialization when Phaser
   * is still setting up sprites.
   * This is to ensure Blockly can load the images correctly into dynamic menu at start up.
   * @returns {string[]}
   */
  private getActiveSpritesFromChallenge(): string[] {
    const keys: string[] = [];

    // Get spritesToLoad from saved state or challenge
    let spritesToLoad: any;
    if (this.spriteStates) {
      spritesToLoad = this.spriteStates;
    } else {
      spritesToLoad = this.challenge.sprites;
    }

    spritesToLoad.forEach(function (sprite: any) {
      if (this.isSandbox) {
        if (sprite.enabled) {
          keys.push(sprite.name);
        }
      } else {
        keys.push(sprite.name);
      }
    }, this);

    return keys;
  }

  /**
   * DESIGN DECISION: CURRENTLY UNUSED
   * Exits playmode if there is only startBlocks in workspace
   * Ie no click, keyboard, collide blocks on sprites.
   * This function is useful for Chapter 1 when there are only startBlocks.
   * Once we introduce other kinds of events like keyboard, click function, this is confusing to students.
   */
  private autoExitPlayIfAnimationOver() {
    let flag = true;

    this.sprites.forEach(function (phaserSprite) {
      if (phaserSprite.upBlocks.length !== 0
        || phaserSprite.downBlocks.length !== 0
        || phaserSprite.leftBlocks.length !== 0
        || phaserSprite.rightBlocks.length !== 0
        || phaserSprite.aBlocks.length !== 0
        || phaserSprite.bBlocks.length !== 0
        || phaserSprite.cBlocks.length !== 0
        || phaserSprite.dBlocks.length !== 0
        || phaserSprite.eBlocks.length !== 0
        || phaserSprite.fBlocks.length !== 0
        || phaserSprite.gBlocks.length !== 0
        || phaserSprite.hBlocks.length !== 0
        || phaserSprite.iBlocks.length !== 0
        || phaserSprite.jBlocks.length !== 0
        || phaserSprite.kBlocks.length !== 0
        || phaserSprite.lBlocks.length !== 0
        || phaserSprite.mBlocks.length !== 0
        || phaserSprite.nBlocks.length !== 0
        || phaserSprite.oBlocks.length !== 0
        || phaserSprite.pBlocks.length !== 0
        || phaserSprite.qBlocks.length !== 0
        || phaserSprite.rBlocks.length !== 0
        || phaserSprite.sBlocks.length !== 0
        || phaserSprite.tBlocks.length !== 0
        || phaserSprite.uBlocks.length !== 0
        || phaserSprite.vBlocks.length !== 0
        || phaserSprite.wBlocks.length !== 0
        || phaserSprite.xBlocks.length !== 0
        || phaserSprite.yBlocks.length !== 0
        || phaserSprite.zBlocks.length !== 0
        || phaserSprite.clickBlocks.length !== 0
        || Object.keys(phaserSprite.collideBlocks).length !== 0) {
        flag = false;
      }
    });

    if (flag) {
      this.pressExit();
    }
  }

  private alertAndExit(message: string) {
    this.sendAlert(message);
    this.pressExit();
  }

  /**
   * Sets Play Mode to given value and emits event via playModeEvent with
   * boolean state of Play Mode.
   * Used to detect Play Mode state in Phaser Component.
   * @param {string} value
   */
  private setPlayMode(value: boolean) {
    this.isInPlayMode = value;
    this.playModeEvent.emit(value);
  }

  /**
   * Emits event via alertErrorEvent with error message.
   * To be displayed in error alert from Phaser Component.
   * @param {string} message
   */
  private sendAlert(message: string) {
    this.alertErrorEvent.emit(message);
  }
}
