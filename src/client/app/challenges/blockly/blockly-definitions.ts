import { SharedConstants } from '../shared/shared-constants';
/**
 * Created by jazlynang on 7/7/2017.
 *
 * This class contains the definitions for custom Blockly blocks
 */

const BLOCKLY_COLOUR_EVENT = 210;
const BLOCKLY_COLOUR_REPEAT = 120;
const BLOCKLY_COLOUR_SCORE = 180;
const BLOCKLY_COLOUR_MOVEMENT = 290;
const BLOCKLY_COLOUR_PEN = 65;
const BLOCKLY_COLOUR_NUMBER = 230;

export class BlocklyDefinitions {

  private static getActiveSprites: Function;  // For dynamic selector in Event Blocks

  /**
   * When called, will execute the code to load the definitions into Blockly.
   * To be used in BlocklyService when initializing workspace.
   *
   * @param Blockly - the Blockly Javascript library
   */
  static setupDefinitions(Blockly: any) {
    // Creates a hat on each Event header block to distinguish itself
    Blockly.BlockSvg.START_HAT = true;

    Blockly.Blocks[SharedConstants.GAKKO_EVENT_ALL] = {
      init: function () {
        const dropdown = new Blockly.FieldDropdown(dynamicOptions);

        this.appendDummyInput()
          .appendField(' ')
          .appendField(dropdown, 'ARG0')
          .appendField('is')
          .appendField(new Blockly.FieldDropdown([['Started', 'EVENT_START'], ['Clicked',
            'EVENT_CLICK']]), 'ARG1');

        this.appendStatementInput('DO');

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_EVENT);
        this.setTooltip('Do something when game starts.');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_EVENT_START] = {
      init: function () {
        const dropdown = new Blockly.FieldDropdown(dynamicOptions);

        this.appendDummyInput()
          .appendField(dropdown, 'ARG0')
          .appendField('When started');

        this.appendStatementInput('DO');

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_EVENT);
        this.setTooltip('Do something when game starts.');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_EVENT_CAT] = {
      init: function () {
        defineEventBlock(this, SharedConstants.SPRITE_CAT, 'Cat');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_EVENT_BUTTERFLY] = {
      init: function () {
        defineEventBlock(this, SharedConstants.SPRITE_BUTTERFLY, 'Butterfly');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_EVENT_BEE] = {
      init: function () {
        defineEventBlock(this, SharedConstants.SPRITE_BEE, 'Bee');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_EVENT_SNAIL] = {
      init: function () {
        defineEventBlock(this, SharedConstants.SPRITE_SNAIL, 'Snail');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_EVENT_RABBIT] = {
      init: function () {
        defineEventBlock(this, SharedConstants.SPRITE_RABBIT, 'Rabbit');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_EVENT_LADYBUG] = {
      init: function () {
        defineEventBlock(this, SharedConstants.SPRITE_LADYBUG, 'Ladybug');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_EVENT_MONKEY] = {
      init: function () {
        defineEventBlock(this, SharedConstants.SPRITE_MONKEY, 'Monkey');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_EVENT_LION] = {
      init: function () {
        defineEventBlock(this, SharedConstants.SPRITE_LION, 'Lion');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_EVENT_OCTOPUS] = {
      init: function () {
        defineEventBlock(this, SharedConstants.SPRITE_OCTOPUS, 'Octopus');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_EVENT_CRAB] = {
      init: function () {
        defineEventBlock(this, SharedConstants.SPRITE_CRAB, 'Crab');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_EVENT_KEYBOARD] = {
      init: function () {
        const dropdown = new Blockly.FieldDropdown(dynamicOptions);

        this.appendDummyInput()
          .appendField(' ')
          .appendField(dropdown, 'ARG0')
          .appendField('When')
          .appendField(new Blockly.FieldDropdown(
            [
              ['up', 'up'],
              ['down', 'down'],
              ['left', 'left'],
              ['right', 'right'],
              ['a', 'a'],
              ['b', 'b'],
              ['c', 'c'],
              ['d', 'd'],
              ['e', 'e'],
              ['f', 'f'],
              ['g', 'g'],
              ['h', 'h'],
              ['i', 'i'],
              ['j', 'j'],
              ['k', 'k'],
              ['l', 'l'],
              ['m', 'm'],
              ['n', 'n'],
              ['o', 'o'],
              ['p', 'p'],
              ['q', 'q'],
              ['r', 'r'],
              ['s', 's'],
              ['t', 't'],
              ['u', 'u'],
              ['v', 'v'],
              ['w', 'w'],
              ['x', 'x'],
              ['y', 'y'],
              ['z', 'z']
            ]), 'ARG1')
          .appendField('is pressed');

        this.appendStatementInput('DO')
          .setCheck(null);

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_EVENT);
        this.setTooltip('Do something when keyboard buttons are pressed.');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_EVENT_COLLISION] = {
      init: function () {
        const dropdown1 = new Blockly.FieldDropdown(dynamicOptions);
        const dropdown2 = new Blockly.FieldDropdown(dynamicOptions);

        this.appendDummyInput()
          .appendField('When')
          .appendField(dropdown1, 'ARG0')
          .appendField('collides with')
          .appendField(dropdown2, 'ARG1');

        this.appendStatementInput('DO')
          .setCheck(null);

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_EVENT);
        this.setTooltip('Do something when this sprite collides with another sprite.');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_EVENT_CLICK] = {
      init: function () {
        const dropdown = new Blockly.FieldDropdown(dynamicOptions);

        this.appendDummyInput()
          .appendField('When')
          .appendField(dropdown, 'ARG0')
          .appendField('is clicked');

        this.appendStatementInput('DO');

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_EVENT);
        this.setTooltip('Do something when this sprite is clicked.');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_EVENT_RECEIVE] = {
      init: function () {
        const dropdown = new Blockly.FieldDropdown(dynamicOptions);

        this.appendDummyInput()
          .appendField(' ')
          .appendField(dropdown, 'ARG0')
          .appendField('when I Receive')
          .appendField(new Blockly.FieldDropdown(dynamicOptionForBroadcast),
            'ARG1');

        this.appendStatementInput('DO');

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_EVENT);
        this.setTooltip('Do something when game starts.');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_EVENT_BROADCAST] = {
      init: function () {
        this.appendDummyInput()
          .appendField('broadcast')
          .appendField(new Blockly.FieldDropdown(dynamicOptionForBroadcast),
            'ARG1');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(BLOCKLY_COLOUR_EVENT);
        this.setTooltip('');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_CONTROLS_REPEAT] = {
      init: function () {
        this.appendValueInput('TIMES')
          .appendField('repeat')
          .setCheck('Number');

        this.appendDummyInput()
          .appendField('times');

        this.appendStatementInput('DO')
          .setCheck(null)
          .appendField('do');

        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_REPEAT);
        this.setTooltip('Do blocks within here several times.');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_CONTROLS_REPEAT_FOREVER] = {
      init: function () {
        this.appendDummyInput()
          .appendField('repeat forever');

        this.appendStatementInput('DO')
          .setCheck(null)
          .appendField('do');

        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_REPEAT);
        this.setTooltip('Do blocks within here forever.');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_SCORE_CHANGE] = {
      init: function () {
        this.appendValueInput('ARG0')
          .appendField('change score by ')
          .setCheck('Number');

        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_SCORE);
        this.setTooltip('Change the score by a positive/negative number.');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_MOVEMENT_JUMP] = {
      init: function () {
        this.appendDummyInput()
          .appendField('jump');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_MOVEMENT);
        this.setTooltip('Make this sprite jump.');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_MOVEMENT_JUMP_HEIGHT] = {
      init: function () {
        this.appendValueInput('ARG0')
          .setCheck('Number')
          .appendField('jump');

        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_MOVEMENT);
        this.setTooltip('Make this sprite jump a particular height.');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_MOVEMENT_FORWARD] = {
      init: function () {
        this.appendValueInput('ARG0')
          .setCheck('Number')
          .appendField('forward');

        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_MOVEMENT);
        this.setTooltip('Make this sprite move forward.');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_MOVEMENT_ROTATE_EASY] = {
      init: function () {
        this.appendDummyInput()
          .appendField('rotate')
          .appendField(new Blockly.FieldAngle(0), 'ARG0')
          .appendField('degrees');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_MOVEMENT);
        this.setTooltip('Make this sprite rotate.');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_MOVEMENT_ROTATE] = {
      init: function () {
        this.appendValueInput('ARG0')
          .setCheck('Number')
          .appendField('rotate');

        this.appendDummyInput()
          .appendField('degrees');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_MOVEMENT);
        this.setTooltip('Make this sprite rotate.');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_MOVEMENT_MOVE_X] = {
      init: function () {
        this.appendValueInput('ARG0')
          .setCheck('Number')
          .appendField('move x');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_MOVEMENT);
        this.setTooltip(`Move a sprite in the x direction.`);
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_MOVEMENT_MOVE_Y] = {
      init: function () {
        this.appendValueInput('ARG0')
          .setCheck('Number')
          .appendField('move y');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_MOVEMENT);
        this.setTooltip(`Move a sprite in the y direction.`);
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_MOVEMENT_MOVE_X_Y] = {
      init: function () {
        this.appendValueInput('ARG0')
          .setCheck('Number')
          .appendField('move x');

        this.appendValueInput('ARG1')
          .setCheck('Number')
          .appendField('y');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_MOVEMENT);
        this.setTooltip(`Move a sprite in the x and y direction.`);
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_MOVEMENT_CHANGE_X_BY] = {
      init: function () {
        this.appendValueInput('ARG0')
          .setCheck('Number')
          .appendField('change x by');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_MOVEMENT);
        this.setTooltip(`Change a sprite's x Position.`);
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_MOVEMENT_CHANGE_Y_BY] = {
      init: function () {
        this.appendValueInput('ARG0')
          .setCheck('Number')
          .appendField('change y by');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_MOVEMENT);
        this.setTooltip(`Change a sprite's y Position.`);
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_MOVEMENT_SET_POSITION] = {
      init: function () {
        this.appendValueInput('ARG0')
          .setCheck('Number')
          .appendField('set position x');

        this.appendValueInput('ARG1')
          .setCheck('Number')
          .appendField('y');

        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_MOVEMENT);
        this.setTooltip('Set a sprite\'s x and y positions.');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_MOVEMENT_SET_SPEED] = {
      init: function () {
        this.appendDummyInput()
          .appendField('set speed to')
          .appendField(new Blockly.FieldDropdown([['slow', SharedConstants.SPEED_SETTING_SLOW],
          ['normal', SharedConstants.SPEED_SETTING_NORMAL],
          ['fast', SharedConstants.SPEED_SETTING_FAST]]), 'ARG0');

        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_MOVEMENT);
        this.setTooltip('Set the speed of this sprite.');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_MOVEMENT_WAIT] = {
      init: function () {
        this.appendValueInput('ARG0')
          .setCheck('Number')
          .appendField('wait');

        this.appendDummyInput()
          .appendField('seconds');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_MOVEMENT);
        this.setTooltip('Make a sprite wait.');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_DRAWING_PEN_ALL] = {
      init: function () {
        this.appendDummyInput()
          .appendField('pen down')
          .appendField(new Blockly.FieldCheckbox('TRUE'), 'ARG0');

        this.appendDummyInput()
          .appendField('colour')
          .appendField(new Blockly.FieldColour(), 'ARG1');

        this.appendValueInput('ARG2')
          .appendField('size')
          .setCheck('Number');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_PEN);
        this.setTooltip('Make this sprite leave a line while moving.');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_DRAWING_PEN_DOWN] = {
      init: function () {
        this.appendDummyInput()
          .appendField('pen down');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setColour(BLOCKLY_COLOUR_PEN);
        this.setTooltip('Make this sprite leave a line while moving.');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_DRAWING_PEN_DOWN_BOOLEAN] = {
      init: function () {
        this.appendDummyInput()
          .appendField('pen down')
          .appendField(new Blockly.FieldCheckbox('TRUE'), 'ARG0');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setColour(BLOCKLY_COLOUR_PEN);
        this.setTooltip('Allow or disallow this sprite to leave a line while moving.');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_DRAWING_PEN_SET_SIZE] = {
      init: function () {
        this.appendValueInput('ARG0')
          .appendField('set pen size')
          .setCheck('Number');

        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_PEN);
        this.setTooltip('Set size of line drawn by pen.');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_DRAWING_PEN_SET_COLOUR] = {
      init: function () {
        this.appendDummyInput()
          .appendField('set pen colour')
          .appendField(new Blockly.FieldColour(), 'ARG0');

        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.setInputsInline(true);
        this.setColour(BLOCKLY_COLOUR_PEN);
        this.setTooltip('Set colour of line drawn by pen.');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_DRAWING_PEN_CLEAR] = {
      init: function () {
        this.appendDummyInput()
          .appendField('clear all pen drawings');

        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.setColour(BLOCKLY_COLOUR_PEN);
        this.setTooltip('This block will clear all pen drawings.');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_RANDOM_NUMBER] = {
      init: function () {
        this.appendValueInput('ARG0')
          .setCheck('Number')
          .appendField('random number from');
        this.appendValueInput('ARG1')
          .setCheck('Number')
          .appendField('to');

        this.setInputsInline(true);
        this.setOutput(true, 'Number');
        this.setColour(BLOCKLY_COLOUR_NUMBER);
        this.setTooltip('Generate a random number between 2 numbers (inclusive).');
      }
    };

    Blockly.Blocks[SharedConstants.GAKKO_AUDIO_SET_SPEECH] = {
      init: function () {
        this.appendValueInput('ARG0')
          .appendField('speech')
          .appendField(new Blockly.FieldTextInput('Say a word'), 'NAME');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(330);
      }
    };
    //================================================================================
    // Helper Functions
    //================================================================================

    /**
     * To be used for defining standard event blocks for single sprites.
     * Due to Blockly's implementation, this function needs to be called from within
     * an anonymous function with an init (see below for example).
     *
     *  init: function() {
     *    defineEventBlock(this, SPRITE_SNAIL, 'Snail');
     *  }
     *
     * @param context: 'this'
     * @param spriteKey: internal name for sprite (to retrieve source image)
     * @param spriteName: name for display in Blockly component
     */
    function defineEventBlock(context: any, spriteKey: string, spriteName: string) {
      context.appendDummyInput()
        .appendField(new Blockly.FieldImage(
          SharedConstants.generateSourceUrl(spriteKey),
          SharedConstants.BLOCK_SPRITE_WIDTH, SharedConstants.BLOCK_SPRITE_HEIGHT, '*'))
        .appendField(spriteName);

      context.appendStatementInput('DO')
        .setCheck(null);

      context.setDeletable(false);
      context.setInputsInline(true);
      context.setColour(BLOCKLY_COLOUR_EVENT);
      context.setTooltip(`Do something when game starts.`);
    }

    /**
     * For populating dynamic dropdown menu in Event Blocks.
     * Will be called each time dropdown menu is clicked.
     * @returns {any}
     */
    function dynamicOptions(): any[] {
      const activeSprites: string[] = BlocklyDefinitions.getActiveSprites();

      // If no sprites
      if (activeSprites.length === 0) {
        return [['none', 'NONE']];
      }

      const options: any[] = [];
      for (let i = 0; i < activeSprites.length; i++) {
        const spriteSrc = SharedConstants.generateSourceUrl(activeSprites[i]);
        options.push([
          {
            'src': spriteSrc,
            'width': SharedConstants.BLOCK_SPRITE_WIDTH,
            'height': SharedConstants.BLOCK_SPRITE_HEIGHT,
            'alt': activeSprites[i]
          },
          activeSprites[i]]);
      }
      return options;
    }
    function dynamicOptionForBroadcast(): any[] {
      const options: any[] = [];
      options.push([
        'message1',
        'MES1'
      ]);
      return options;
    }
  }

  //================================================================================
  // Setter Functions
  //================================================================================
  /**
   * Sets getActiveSprites function in this class with the getter function from Phaser Component.
   * @param getActiveSpritesFunction
   */
  static setActiveSpritesFunction(getActiveSpritesFunction: Function) {
    BlocklyDefinitions.getActiveSprites = getActiveSpritesFunction;
  }
}
